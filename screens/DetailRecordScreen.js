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

          console.log(id);
          console.log(images);
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

  return (
    <View style={styles.container}>
      <Header
        left="이전"
        title="상세기록"
        right="완료"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={() => {
          navigation.push("DoneRecord");

          // DB에 저장
          console.log(homeText);
          console.log(schoolText);
          console.log(hospitalText);
          for (let i = 0; i < images.length; i++) {
            console.log(i, images[i].uri);
          }
        }}
        line={false}
      />
      <View style={styles.progress} />
      <ScrollView style={styles.scroll}>
        <View style={styles.subContainer}>
          <Text style={styles.guideText}>
            우리 아이의 증상을 자세히 기록해요
          </Text>
          <Text style={styles.subText}>
            기록할 내용이 없다면 공한으로 둬도 괜찮아요
          </Text>
        </View>
        <View style={{ marginLeft: 27 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoScroll}
          >
            <TouchableOpacity activeOpacity={0.5} onPress={uploadImage}>
              <View style={styles.photo}>
                <Feather name="camera" size={20} color="black" />
                <Text style={{ fontSize: 12 }}>{images.length}/10</Text>
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
                    <Ionicons name="close" size={15} color="black" />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.inputGuideText}>가정에서 우리 아이는</Text>
          <TextInput
            placeholder="가정에서 우리 아이가 어땠는지 작성해주세요"
            style={styles.input}
            multiline
            maxLength={600}
            numberOfLines={4}
            onChangeText={setHomeText}
            returnKeyType="done"
          ></TextInput>
          <View
            style={{
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.limitText}>{homeText.length}/600</Text>
          </View>
          <Text style={styles.inputGuideText}>학교에서 우리 아이는</Text>
          <TextInput
            placeholder="학교에서 우리 아이가 어땠는지 작성해주세요"
            style={styles.input}
            multiline
            maxLength={600}
            numberOfLines={4}
            onChangeText={setSchoolText}
            returnKeyType="done"
          ></TextInput>
          <View
            style={{
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.limitText}>{schoolText.length}/600</Text>
          </View>
          <Text style={styles.inputGuideText}>병원에서 우리 아이는</Text>
          <TextInput
            placeholder="병원에서 우리 아이가 어땠는지 작성해주세요"
            style={styles.input}
            multiline
            maxLength={600}
            numberOfLines={4}
            returnKeyType="done"
            onChangeText={setHospitalText}
          ></TextInput>
          <View
            style={{
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.limitText}>{hospitalText.length}/600</Text>
          </View>
        </View>
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
  progress: {
    width: "100%",
    height: 8,
    backgroundColor: theme.green500,
  },
  scroll: {
    paddingVertical: 23,
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 27,
  },
  guideText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 4,
    color: "grey",
  },
  subText: {
    fontSize: 12,
    color: "grey",
  },
  photoScroll: { marginTop: 30 },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  deleteButton: {
    position: "absolute",
    top: -65, // 이미지의 상단에서 10포인트 떨어진 위치
    right: 3, // 이미지의 오른쪽에서 10포인트 떨어진 위치
    backgroundColor: "white",
    borderRadius: 20,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 7, // Android에서 그림자를 설정하기 위한 속성
  },
  inputGuideText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 6,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "lightgrey",
    textAlignVertical: "top",
  },
  limitText: {},
});
