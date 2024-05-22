import { View, Dimensions, Text, StyleSheet, ScrollView } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

// Dimensions로 화면 크기 가져오기
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function DetailRecordScreen({ navigation }) {
  return (
    <View style={styles.container}>
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
            <TouchableOpacity activeOpacity={0.7}>
              <View style={styles.photo}>
                <Feather name="camera" size={20} color="black" />
                <Text style={{ fontSize: 12 }}>0/10</Text>
              </View>
            </TouchableOpacity>
            <>
              <View style={styles.photo}></View>
              <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.deleteButton}>
                  <Ionicons
                    name="close"
                    size={SCREEN_WIDTH / 25}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </>
            <>
              <View style={styles.photo}></View>
              <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.deleteButton}>
                  <Ionicons
                    name="close"
                    size={SCREEN_WIDTH / 25}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </>
            <>
              <View style={styles.photo}></View>
              <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.deleteButton}>
                  <Ionicons
                    name="close"
                    size={SCREEN_WIDTH / 25}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </>
            <>
              <View style={styles.photo}></View>
              <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.deleteButton}>
                  <Ionicons
                    name="close"
                    size={SCREEN_WIDTH / 25}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </>
            <>
              <View style={styles.photo}></View>
              <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.deleteButton}>
                  <Ionicons
                    name="close"
                    size={SCREEN_WIDTH / 25}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </>
          </ScrollView>
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.inputGuideText}>가정에서 우리 아이는</Text>
          <TextInput
            placeholder="가정에서 우리 아이가 어땠는지 작성해주세요"
            style={styles.input}
            returnKeyType="done"
            multiline
            numberOfLines={4}
          ></TextInput>
          <Text style={styles.inputGuideText}>학교에서 우리 아이는</Text>
          <TextInput
            placeholder="학교에서 우리 아이가 어땠는지 작성해주세요"
            style={styles.input}
            returnKeyType="done"
            multiline
            numberOfLines={4}
          ></TextInput>
          <Text style={styles.inputGuideText}>병원에서 우리 아이는</Text>
          <TextInput
            placeholder="병원에서 우리 아이가 어땠는지 작성해주세요"
            style={styles.input}
            returnKeyType="done"
            multiline
            numberOfLines={4}
          ></TextInput>
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
    width: SCREEN_WIDTH,
    height: 6,
    backgroundColor: "lightgrey",
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
    width: SCREEN_WIDTH / 6,
    height: SCREEN_WIDTH / 6,
    borderRadius: 8,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  deleteButton: {
    position: "absolute",
    top: -7, // 이미지의 상단에서 10포인트 떨어진 위치
    right: 3, // 이미지의 오른쪽에서 10포인트 떨어진 위치
    backgroundColor: "white",
    borderRadius: 20,
    width: SCREEN_WIDTH / 17,
    height: SCREEN_WIDTH / 17,
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
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    textAlignVertical: "top",
  },
});
