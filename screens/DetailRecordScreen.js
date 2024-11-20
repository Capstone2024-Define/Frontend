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
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import summarize from "./ChatgptAPI";
import { bottomBtn } from "../component/BottomButton";

export default function DetailRecordScreen({ navigation, route }) {
  const { ipnumber, date, user_code } = route.params;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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
        console.log("이미지 선택 응답: ", result);
        console.log("이미지 선택 응답: ", result.assets);

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

  // 이미지 삭제
  const deleteImage = (key) => {
    setImages(images.filter((image) => image.id !== key));
    //console.log(images);
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
      // 전체 텍스트 요약(챗지피티)
      let summarizeText = "";

      if (totalText.length > 50) {
        summarizeText = await summarize(totalText);
      } else {
        summarizeText = totalText;
      }

      // console.log("전송 데이터:", {
      //   user_code: user_code,
      //   date: date,
      //   home: homeText,
      //   school: schoolText,
      //   hospital: hospitalText,
      //   summary: summarizeText,
      //   state: route.params.state,
      //   checklist: route.params.symptomList,
      //   parentlist: route.params.checkList,
      // });

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

      // 병렬로 요청 실행
      // await Promise.all([
      //   // 증상 체크리스트 저장
      //   axios.post(`http://${ipnumber}:8080/sx/post`, {
      //     user_code: user_code,
      //     date: date,
      //     checklist: route.params.symptomList,
      //   }),

      //   // 부모 체크리스트 저장
      //   axios.post(`http://${ipnumber}:8080/prnt/post`, {
      //     user_code: user_code,
      //     date: date,
      //     checklist: route.params.checkList,
      //   }),
      // ]);

      const postSymptomCheck = route.params.symptomList?.length
        ? axios.post(`http://${ipnumber}:8080/sx/post`, {
            user_code: user_code,
            date: date,
            checklist: route.params.symptomList,
          })
        : Promise.resolve(); // 빈 체크리스트인 경우 요청 생략

      const postParentCheck = route.params.checkList?.length
        ? axios.post(`http://${ipnumber}:8080/prnt/post`, {
            user_code: user_code,
            date: date,
            checklist: route.params.checkList,
          })
        : Promise.resolve();

      // 이미지
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append("multipartFiles", {
          uri: image.uri,
          name: `image${index}.jpg`,
          type: "image/jpeg",
        });
      });
      formData.append("user_code", user_code);
      formData.append("date", date);

      const uploadImages = await fetch(`http://${ipnumber}:8080/image/post`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 모든 요청을 병렬로 처리
      await Promise.all([postSymptomCheck, postParentCheck, uploadImages]);
    } catch (error) {
      console.log("POST 에러: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        left="leftArrow"
        title="종합기록"
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
          <Text
            style={styles.guideText}
          >{`오늘 우리아이와의 하루를${"\n"}자세히 기록해주세요!`}</Text>
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
          </View>
          <TextInput
            placeholder="가정에서 있었던 일을 작성해주세요"
            style={{
              ...styles.input,
              backgroundColor:
                homeText.length > 0 ? theme.green50 : theme.grey100,
              borderColor: homeText.length > 0 ? theme.green500 : "white",
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
          </View>
          <TextInput
            placeholder="학교에서 있었던 일을 작성해주세요"
            style={{
              ...styles.input,
              backgroundColor:
                schoolText.length > 0 ? theme.green50 : theme.grey100,
              borderColor: schoolText.length > 0 ? theme.green500 : "white",
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
          </View>
          <TextInput
            placeholder="병원에서 있었던 일을 작성해주세요"
            style={{
              ...styles.input,
              backgroundColor:
                hospitalText.length > 0 ? theme.green50 : theme.grey100,
              borderColor: hospitalText.length > 0 ? theme.green500 : "white",
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
            disabled={homeText.length <= 0}
            onPress={async () => {
              await handlePost();
              navigation.navigate("Main", {
                ipnumber: ipnumber,
                user_code: user_code,
                showTutorial: false,
              });
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
