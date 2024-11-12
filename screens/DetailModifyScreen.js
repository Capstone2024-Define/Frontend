import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Image,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useState, useEffect, useCallback } from "react";
import Header from "../component/Header";
import * as ImagePicker from "expo-image-picker";
import { showToast } from "../component/Toast";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Camera from "../assets/photo_camera.svg";
import Home from "../assets/home_green.svg";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import Mic from "../assets/mic_green.svg";
import VoiceButton from "../component/VoiceButton";
import X from "../assets/close_small.svg";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import summarize from "./ChatgptAPI";

export default function DetailModifyScreen({ navigation, route }) {
  // 상세 기록 state
  const [homeText, setHomeText] = useState("");
  const [schoolText, setSchoolText] = useState("");
  const [hospitalText, setHospitalText] = useState("");
  const [state, setState] = useState("");
  const [voiceList, setVoiceList] = useState([]); // 음성 기록
  const [totalText, setTotalText] = useState("");
  const { date, user_code, ipnumber } = route.params;

  // 갤러리 권한
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [images, setImages] = useState([]);

  // 기록 로드
  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(
          `http://${ipnumber}:8080/daily/records/${user_code}/${date}`
        );
        setHomeText(response.data.home);
        setSchoolText(response.data.school);
        setHospitalText(response.data.hospital);
        setState(response.data.state);

        // 이미지 로드
        const response_image = await axios.get(
          `http://${ipnumber}:8080/image/show/${user_code}/${date}`
        );
        if (response_image.data.length > 0) {
          console.log("이미지 로드: ", response_image.data);
          setImages(response_image.data);
        }
      } catch (e) {
        console.log("기록 로드 에러");
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

  useEffect(() => {
    console.log(images);
  }, [images]);

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
          console.log(selectedUri);

          // 이미지 객체 배열에 추가
          const newImage = selectedUri.map((uri) => {
            return uri;
          });
          setImages(images.concat(newImage));
        }
      } catch (error) {
        console.log(error);
        showToast("업로드 실패, 다시 시도해주세요");
      }
    } else {
      showToast("이미지는 최대 10장입니다");
    }
  };

  // 이미지 삭제 함수 (URI 기반)
  const deleteImage = async (uri) => {
    try {
      if (uri.startsWith("http")) {
        // setDeleteTargetImages((prev) => [...prev, uri]);
        const sliceURL = uri.split(".com/")[1];
        console.log("삭제 대상: ", sliceURL);
        await axios.put(
          `http://${ipnumber}:8080/image/edit/${user_code}/${date}`,
          {},
          {
            headers: {
              url: sliceURL, // 헤더에 url을 추가
            },
          }
        );
        console.log(sliceURL, " 삭제완료");
      }
      setImages((prev) => prev.filter((image) => image !== uri));
    } catch (error) {
      console.log("이미지 삭제 에러: ", error);
    }
  };

  // 음성 기록
  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const response = await axios.get(
            `http://${ipnumber}:8080/record/list-up/${user_code}/${date}`
          );
          setVoiceList(response.data);
        } catch (e) {
          console.log("음성 GET 에러: ", error);
        }
      }
      load();
    }, [])
  );

  // 기록 저장
  const handlePost = async () => {
    try {
      // 전체 텍스트 요약
      // 챗지피티 요약
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
        state: state,
      });

      // 수정
      await axios.put(`http://${ipnumber}:8080/daily/records/edit`, {
        user_code: user_code,
        date: date,
        home: homeText,
        school: schoolText,
        hospital: hospitalText,
        summary: summarizeText,
        state: state,
      });

      // 이미지 다시 저장(서버 이미지들 제외)
      const formData = new FormData();
      images.forEach((image, index) => {
        if (image.startsWith("file")) {
          console.log("file로 시작하나요? ", image);
          formData.append("multipartFiles", {
            uri: image,
            name: `image${index}.jpg`,
            type: "image/jpeg",
          });
        }
      });
      formData.append("user_code", user_code);
      formData.append("date", date);

      await fetch(`http://${ipnumber}:8080/image/post`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("수정 완료");
    } catch (error) {
      console.log("수정 에러", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        left="leftArrow"
        title="수정하기"
        right="완료"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={async () => {
          if (homeText.length > 0) {
            await handlePost();
            navigation.pop();
            showToast("기록이 수정되었어요");
          }
        }}
        line={true}
        rightDisable={homeText.length > 0 ? false : true}
      />
      <ScrollView style={styles.scroll}>
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
          {images.map((image, index) => (
            <View key={index}>
              <Image
                source={{ uri: image }}
                style={styles.photo}
                resizeMode="cover"
              />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={async () => {
                  await deleteImage(image);
                }}
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
          >
            {homeText}
          </TextInput>

          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={School} />
            <Text style={styles.inputGuideText}>학교에서 어땠나요?</Text>
            <Text
              style={[
                styles.inputGuideText,
                { marginLeft: 4, color: theme.grey300 },
              ]}
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
          >
            {schoolText}
          </TextInput>
          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={Hospital} />
            <Text style={styles.inputGuideText}>병원에서 어땠나요?</Text>
            <Text
              style={[
                styles.inputGuideText,
                { marginLeft: 4, color: theme.grey300 },
              ]}
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
          >
            {hospitalText}
          </TextInput>
          {voiceList.length !== 0 && (
            <>
              <View style={{ ...styles.subTextContainer, marginTop: 12 }}>
                <WithLocalSvg width={20} height={20} asset={Mic} />
                <Text style={styles.inputGuideText}>상담녹음</Text>
              </View>

              {voiceList.map((voice, index) => (
                <VoiceButton
                  key={`${index}`}
                  place={voice.location}
                  time={voice.timestamp}
                  text={voice.contents}
                  onPress={() =>
                    navigation.push("DetailVoice", {
                      detail: false,
                      user_code: user_code,
                      ipnumber: ipnumber,
                      timestamp: voice.timestamp,
                    })
                  }
                />
              ))}
            </>
          )}
        </View>

        <View style={{ marginBottom: 50 }}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scroll: {},
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  photoScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    marginTop: 28,
    marginBottom: 8,
  },
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
    marginTop: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  inputGuideText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    marginLeft: 8,
    color: theme.grey600,
  },
  input: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.green50,
    textAlignVertical: "top",
    fontFamily: "Human-beomseok",
    lineHeight: 19.6,
    borderWidth: 1,
    borderColor: "white",
  },
});
