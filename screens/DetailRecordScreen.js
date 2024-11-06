import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Image,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useState, useEffect, useLayoutEffect } from "react";
import Header from "../component/Header";
import * as ImagePicker from "expo-image-picker";
import { showToast } from "../component/Toast";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Camera from "../assets/photo_camera.svg";
import Home from "../assets/home_green.svg";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import X from "../assets/close_small.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import summary from "./SummaryAPI";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import summarize from "./ChatgptAPI";
import { bottomBtn } from "../component/BottomButton";

export default function DetailRecordScreen({ navigation, route }) {
  const { ipnumber, date, user_code } = route.params;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [name, setName] = useState("");

  // 상세 기록 state
  const [homeText, setHomeText] = useState("");
  const [schoolText, setSchoolText] = useState("");
  const [hospitalText, setHospitalText] = useState("");
  const [totalText, setTotalText] = useState("");

  // 갤러리 권한
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  // 이미지 배열
  const [images, setImages] = useState([]);
  // 이미지 객체 id 설정 위한 변수
  const [id, setId] = useState(0);
  let k = 0;

  // 키보드 활성화 시 감지
  useLayoutEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // 아이 이름 로드
  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(
          `http://${ipnumber}:8080/userinfo/get/${user_code}`
        );
        setName(response.data.child_name);
      } catch (error) {
        console.log("유저 GET 에러: ", error);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let newTotalText = "";
    if (homeText) {
      newTotalText += homeText;
    }
    if (schoolText) {
      newTotalText += ` ${schoolText}`;
    }
    if (hospitalText) {
      newTotalText += ` ${hospitalText}`;
    }
    setTotalText(newTotalText);
  }, [homeText, schoolText, hospitalText]);

  // 이미지 업로드
  const uploadImage = async () => {
    // 권한 확인 코드
    if (!status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
        // 권한 계속 거부된 경우 설정으로 안내
        Alert.alert(
          "권한 필요",
          "갤러리 접근을 허용해야합니다. 설정에서 권한을 허용해주세요.",
          [
            { text: "취소", style: "cancel" },
            { text: "설정으로 이동", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
    }

    // 이미지 업로드 기능
    if (images.length < 10) {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.5,
          allowsMultipleSelection: true,
          selectionLimit: 10 - images.length,
        });
        //console.log(result);

        if (!result.cancelled && result.assets && result.assets.length > 0) {
          // 이미지 업로드 결과
          const selectedUri = result.assets.map((asset) => asset.uri);
          //console.log(selectedUri);

          // 이미지 객체 배열에 추가
          const newImage = selectedUri.map((uri) => {
            return { id: id + k++, uri: uri };
          });
          setImages(images.concat(newImage));
          setId(id + k);
          //console.log(await fetchImageFromUri(newImage[0].uri));
        }
      } catch (error) {
        console.log(error);
        showToast("업로드 실패, 다시 시도해주세요");
      }
    } else {
      showToast("이미지는 최대 10장입니다");
    }
  };

  // 이미지 서버에 올릴 형태로 바꿈
  const fetchImageFromUri = async () => {
    const newImage = await Promise.all(
      images.map(async (image) => {
        const response = await fetch(image.uri);
        return await response.blob();
      })
    );

    console.log("이미지 blob: ", newImage);

    return newImage;
  };

  // 이미지 삭제
  const deleteImage = (key) => {
    setImages(images.filter((image) => image.id !== key));
    //console.log(images);
  };

  // TextInput 제한 글자 색
  const getColor = (num, length) => {
    if (length === 0) {
      return theme.grey400;
    } else if (length > num) {
      return "#F86D6D";
    } else {
      return theme.grey600;
    }
  };

  // 이름 받침 여부 확인
  const nameCheck = (name) => {
    const lastChar = name.charAt(name.length - 1); // 마지막 글자 가져오기
    const lastCharCode = lastChar.charCodeAt(0); // 마지막 글자의 유니코드 값 가져오기

    // 한글 유니코드에서 '가'의 유니코드 값 0xAC00을 뺀 값에서 28로 나눈 나머지가 받침 유무를 결정
    const baseCode = lastCharCode - 0xac00;
    const jongseong = baseCode % 28; // 받침 여부를 결정하는 값 (종성)

    return jongseong !== 0; // 나머지가 0이 아니면 받침이 있는 것
  };

  // 저장
  const handlePost = async () => {
    try {
      // 전체 텍스트 요약
      // 서머리
      // const result = await summary(totalText);
      // console.log(result.summary);

      // 챗지피티 - 요금때문에 일단 주석처리하고 서머리로 진행(작동확인 완)
      let summarizeText = "";

      if (totalText.length > 50) {
        summarizeText = await summarize(totalText);
      } else {
        summarizeText = totalText;
      }

      console.log("전송 데이터:", {
        user_code: user_code,
        date: date,
        home: homeText,
        school: schoolText,
        hospital: hospitalText,
        summary: summarizeText,
        state: route.params.state,
        checklist: route.params.symptomList,
        parentlist: route.params.checkList,
      });

      // 줄글 저장
      await axios.post(`http://${ipnumber}:8080/daily/post`, {
        user_code: user_code,
        date: date,
        home: homeText,
        school: schoolText,
        hospital: hospitalText,
        summary: summarizeText,
        state: route.params.state,
      });

      // 이미지 데이터 준비
      const postingImages = await fetchImageFromUri();
      const formData = new FormData();
      postingImages.forEach((blob, index) => {
        formData.append("url", require("../assets/happy.png"));
      });
      formData.append("user_code", user_code);
      formData.append("date", date);

      // 병렬로 요청 실행
      await Promise.all([
        // 증상 체크리스트 저장
        axios.post(`http://${ipnumber}:8080/sx/post`, {
          user_code: user_code,
          date: date,
          checklist: route.params.symptomList,
        }),

        // 부모 체크리스트 저장
        axios.post(`http://${ipnumber}:8080/prnt/post`, {
          user_code: user_code,
          date: date,
          checklist: route.params.checkList,
        }),

        // 이미지 저장
        axios.post(`http://${ipnumber}:8080/image/post`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      ]);

      console.log("POST 성공");
    } catch (error) {
      console.log("POST 에러: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        left="leftArrow"
        title="기록하기"
        onLeftPress={() => {
          navigation.pop();
        }}
      />
      <LinearGradient
        colors={["#79BA7E", "#AFCA85"]}
        style={{ width: "100%", height: 4 }}
        start={{ x: 1, y: 0 }} // 그라데이션의 시작 지점 (오른쪽)
        end={{ x: 0, y: 0 }} // 그라데이션의 끝 지점 (왼쪽)
      >
        <View style={styles.progress} />
      </LinearGradient>
      <ScrollView style={styles.scroll}>
        <View style={styles.subContainer}>
          <Text style={styles.guideText}>{`오늘 ${name}${
            nameCheck(name) ? "이" : ""
          }의 하루를 ${"\n"}자세히 기록해주세요!`}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScroll}
        >
          <TouchableOpacity activeOpacity={0.5} onPress={uploadImage}>
            <View style={styles.photo}>
              <WithLocalSvg width={24} height={24} asset={Camera} />
              <View style={{ flexDirection: "row", marginTop: 4 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: theme.green500,
                  }}
                >
                  {images.length}
                </Text>
                <Text style={styles.photoText}> / 10</Text>
              </View>
            </View>
          </TouchableOpacity>
          {images.map((image) => (
            <View key={image.id}>
              <Image
                source={{ uri: image.uri }}
                style={styles.photo}
                resizeMode="cover"
              />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => deleteImage(image.id)}
              >
                <View style={styles.deleteButton}>
                  <WithLocalSvg width={18} height={18} asset={X} />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View style={styles.subContainer}>
          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={Home} />
            <Text style={styles.inputGuideText}>가정에서 어땠나요?</Text>
            <View style={styles.limit}>
              <Text
                style={{
                  ...styles.limitText1,
                  color: getColor(800, homeText.length),
                }}
              >
                {homeText.length}
              </Text>
              <Text style={styles.limitText2}>/800</Text>
            </View>
          </View>
          <TextInput
            placeholder="가정에서 있었던 일을 작성해주세요"
            style={{
              ...styles.input,
              backgroundColor:
                homeText.length > 800
                  ? theme.grey100
                  : homeText.length > 0
                  ? theme.green50
                  : theme.grey100,
              borderColor:
                homeText.length > 800
                  ? theme.red
                  : homeText.length > 0
                  ? theme.green500
                  : "white",
            }}
            placeholderTextColor={theme.grey400}
            multiline
            numberOfLines={2}
            onChangeText={setHomeText}
            returnKeyType="done"
          ></TextInput>

          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={School} />
            <Text style={styles.inputGuideText}>학교에서 어땠나요?</Text>
            <Text
              style={{
                ...styles.inputGuideText,
                marginLeft: 4,
                color: theme.grey300,
              }}
            >
              (선택)
            </Text>
            <View style={styles.limit}>
              <Text
                style={{
                  ...styles.limitText1,
                  color: getColor(600, schoolText.length),
                }}
              >
                {schoolText.length}
              </Text>
              <Text style={styles.limitText2}>/600</Text>
            </View>
          </View>
          <TextInput
            placeholder="학교에서 있었던 일을 작성해주세요"
            style={{
              ...styles.input,
              backgroundColor:
                schoolText.length > 600
                  ? theme.grey100
                  : schoolText.length > 0
                  ? theme.green50
                  : theme.grey100,
              borderColor:
                schoolText.length > 600
                  ? theme.red
                  : schoolText.length > 0
                  ? theme.green500
                  : "white",
            }}
            multiline
            numberOfLines={2}
            onChangeText={setSchoolText}
            returnKeyType="done"
          ></TextInput>

          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={Hospital} />
            <Text style={styles.inputGuideText}>병원에서 어땠나요?</Text>
            <Text
              style={{
                ...styles.inputGuideText,
                marginLeft: 4,
                color: theme.grey300,
              }}
            >
              (선택)
            </Text>
            <View style={styles.limit}>
              <Text
                style={{
                  ...styles.limitText1,
                  color: getColor(600, hospitalText.length),
                }}
              >
                {hospitalText.length}
              </Text>
              <Text style={styles.limitText2}>/600</Text>
            </View>
          </View>
          <TextInput
            placeholder="병원에서 있었던 일을 작성해주세요"
            style={{
              ...styles.input,
              backgroundColor:
                hospitalText.length > 600
                  ? theme.grey100
                  : hospitalText.length > 0
                  ? theme.green50
                  : theme.grey100,
              borderColor:
                hospitalText.length > 600
                  ? theme.red
                  : hospitalText.length > 0
                  ? theme.green500
                  : "white",
            }}
            multiline
            numberOfLines={2}
            returnKeyType="done"
            onChangeText={setHospitalText}
          ></TextInput>
        </View>
        <View
          style={{
            alignItems: "flex-end",
          }}
        ></View>
        <View style={{ marginBottom: 80 }}></View>
      </ScrollView>
      {!isKeyboardVisible && (
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            disabled={
              !totalText ||
              homeText.length > 800 ||
              schoolText.length > 600 ||
              hospitalText.length > 600 ||
              homeText.length <= 0
            }
            onPress={async () => {
              await handlePost();
              navigation.popToTop();
              showToast("기록이 완료되었어요");
            }}
          >
            <LinearGradient
              colors={["#79BA7E", "#AFCA85"]}
              style={bottomBtn.button}
            >
              <View
                style={[
                  bottomBtn.button,
                  { backgroundColor: theme.grey250 },
                  totalText &&
                    homeText.length <= 800 &&
                    schoolText.length <= 600 &&
                    hospitalText.length <= 600 &&
                    homeText.length > 0 && {
                      backgroundColor: "transparent",
                    },
                ]}
              >
                <Text style={bottomBtn.buttonText}>완료</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  progress: {
    width: "100%",
    height: 4,
    backgroundColor: "transparent",
  },
  scroll: {},
  subContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  guideText: {
    fontSize: 20,
    fontFamily: "Pretendard-Bold",
    lineHeight: 30,
    marginTop: 20,
    color: theme.grey800,
  },
  photoScroll: { marginLeft: 16, marginVertical: 20 },
  photo: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.grey150,
  },
  photoText: {
    fontSize: 12,
    // fontWeight: "400",
    fontFamily: "Pretendard-Regular",
    color: theme.grey800,
  },
  deleteButton: {
    position: "absolute",
    top: -65, // 이미지의 상단에서 떨어진 위치
    right: 6, // 이미지의 오른쪽에서떨어진 위치
    backgroundColor: "white",
    borderRadius: 16,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 4,
  },
  subTextContainer: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  inputGuideText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    marginLeft: 8,
    color: theme.grey800,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.grey100,
    textAlignVertical: "top",
    fontFamily: "Human-beomseok",
    lineHeight: 19.6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "white",
  },
  limit: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  limitText1: { fontSize: 12, fontFamily: "Pretendard-Medium" },
  limitText2: {
    fontSize: 12,
    fontFamily: "Pretendard-Medium",
    color: theme.grey400,
  },
});
