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
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import Header from "../component/Header";
import * as ImagePicker from "expo-image-picker";
import { showToast } from "../component/Toast";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Camera from "../assets/photo_camera.svg";
import Home from "../assets/home.svg";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import VoiceButton from "../component/VoiceButton";
import X from "../assets/close_small.svg";

// 상세 기록 DB
// 날짜(date), 유저아이디(user_id)
// 가정기록(detail_home), 학교기록(detail_school), 병원기록(detail_hospital)

// 사진 DB
// 날짜(date), 유저아이디(user_id)
// 인덱스(index, 0~9), 사진(image)

export default function DetailRecordScreen({ navigation }) {
  // 상세 기록 state
  const [homeText, setHomeText] = useState("");
  const [schoolText, setSchoolText] = useState("");
  const [hospitalText, setHospitalText] = useState("");
  const [totalText, setTotalText] = useState("");

  // totalText 계산
  useEffect(() => {
    setTotalText(homeText + schoolText + hospitalText);
    //console.log(`전체 텍스트 : ${totalText}`);
  }, [homeText, schoolText, hospitalText]);

  // 갤러리 권한
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  // 이미지 배열
  const [images, setImages] = useState([]);
  // 이미지 객체 id 설정 위한 변수
  const [id, setId] = useState(0);
  let k = 0;

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
            return { id: id + k++, uri: uri };
          });
          setImages(images.concat(newImage));
          setId(id + k);
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
    console.log(images);
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

  return (
    <View style={styles.container}>
      <Header
        left="leftArrow"
        title="수정하기"
        right="완료"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={() => {
          navigation.pop();
          showToast("기록이 완료되었어요");

          // DB에 저장
          console.log(homeText);
          console.log(schoolText);
          console.log(hospitalText);
          for (let i = 0; i < images.length; i++) {
            console.log(i, images[i].uri);
          }
        }}
        line={true}
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
            style={styles.input}
            placeholderTextColor={theme.grey400}
            multiline
            numberOfLines={2}
            onChangeText={setHomeText}
            returnKeyType="done"
            defaultValue="아침에 일어나기 어려워함. 기상 후에도 집중력이 부족해 아침 준비가 늦어짐.
저녁 식사 중간에 계속 자리를 떠서 여러 번 주의를 줌. 식사 후 설거지를 도와주었음.
숙제를 할 때 집중하지 못하고 자주 딴짓을 해서 함께 앉아 도와주며 완료함."
          ></TextInput>

          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={School} />
            <Text style={styles.inputGuideText}>학교에서 어땠나요?</Text>
            <View style={styles.limit}>
              <Text
                style={{
                  ...styles.limitText1,
                  color: getColor(10, schoolText.length),
                }}
              >
                {schoolText.length}
              </Text>
              <Text style={styles.limitText2}>/600</Text>
            </View>
          </View>
          <TextInput
            placeholder="학교에서 있었던 일을 작성해주세요"
            style={styles.input}
            multiline
            numberOfLines={2}
            onChangeText={setSchoolText}
            returnKeyType="done"
          ></TextInput>

          <VoiceButton
            onPress={() =>
              navigation.navigate("DetailVoice", {
                detail: true,
              })
            }
          />
          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={Hospital} />
            <Text style={styles.inputGuideText}>병원에서 어땠나요?</Text>
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
            style={styles.input}
            multiline
            numberOfLines={2}
            returnKeyType="done"
            onChangeText={setHospitalText}
            defaultValue="오늘은 ADHD 정기 검진 날. 의사와 상담 후 약물 조정이 필요하다고 판단됨.
의사 선생님이 추천해준 행동치료 프로그램에 등록하기로 결정함.
치료 계획에 대해 상담하고 가정에서 할 수 있는 행동 관리 방법에 대해 교육 받음."
          ></TextInput>
        </View>
        <View
          style={{
            alignItems: "flex-end",
          }}
        ></View>
        <View style={{ marginBottom: 70 }}></View>
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
    paddingHorizontal: 24,
  },
  photoScroll: { marginLeft: 24, marginTop: 28, marginBottom: 8 },
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
