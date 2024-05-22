import { StyleSheet, View, Text, ScrollView, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";

// Dimensions로 화면 크기 가져오기
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function RecordHistory({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.subContainer}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.guideText}>기록요약</Text>
          <FontAwesome5 name="smile" size={18} color="black" />
        </View>
        <Text style={styles.subText}>
          오늘 우리 아이의 증상은 이랬습니다 저랬습니다 오늘 하루는 어땠습니다
          학교에서는 저랬습니다
        </Text>
      </View>
      <View style={styles.scroll}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagScroll}
        >
          <View style={styles.tag}>
            <Text style={styles.tagText}>고자질</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>끼어들기</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>자기연민</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>고자질</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>끼어들기</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>끼어들기</Text>
          </View>
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScroll}
        >
          <View style={styles.photo}></View>
          <View style={styles.photo}></View>
          <View style={styles.photo}></View>
          <View style={styles.photo}></View>
          <View style={styles.photo}></View>
          <View style={styles.photo}></View>
        </ScrollView>
      </View>
      <View style={styles.subContainer}>
        <View style={styles.recordView}>
          <Text style={styles.recordText1}>가정에서 우리 아이는</Text>
          <Text style={styles.recordText2}>
            상세 기록을 하지 않았어요! 상세 기록을 하지 않았어요!상세 기록을
            하지 않았어요!상세 기록을 하지 않았어요!상세 기록을 하지
            않았어요!상세 기록을 하지 않았어요!상세 기록을 하지 않았어요!상세
            기록을 하지 않았어요!상세 기록을 하지 않았어요!상세 기록을 하지
            않았어요!상세 기록을 하지 않았어요!상세 기록을 하지 않았어요!상세
            기록을 하지 않았어요!상세 기록을 하지 않았어요!상세 기록을 하지
            않았어요!상세 기록을 하지 않았어요!상세 기록을 하지 않았어요!상세
            기록을 하지 않았어요!상세 기록을 하지 않았어요!상세 기록을 하지
            않았어요!
          </Text>
        </View>
        <View style={styles.recordView}>
          <Text style={styles.recordText1}>학교에서 우리 아이는</Text>
          <Text style={styles.recordText2}>상세 기록을 하지 않았어요!</Text>
        </View>
        <View style={styles.recordView}>
          <Text style={styles.recordText1}>병원에서 우리 아이는</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ alignItems: "center" }}
          >
            <View style={styles.voiceButton}>
              <View style={styles.place}>
                <Text style={styles.placeText}>병원</Text>
              </View>
              <View style={styles.voiceContent}>
                <Text style={styles.voiceTime}>오후 4:50</Text>
                <Text style={styles.voiceText}>
                  앞 내용 짧은 글로 보여주기 어쩌구
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ marginBottom: 70 }}></View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 23,
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 27,
  },
  guideText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginRight: 7,
  },
  subText: {
    fontSize: 12,
    color: "grey",
  },
  scroll: {
    marginLeft: 27,
  },
  tagScroll: { marginTop: 25 },
  tag: {
    height: SCREEN_WIDTH / 13,
    borderRadius: 5,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    color: "white",
  },
  photoScroll: { marginTop: 15 },
  photo: {
    width: SCREEN_WIDTH / 5,
    height: SCREEN_WIDTH / 5,
    borderRadius: 8,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  recordText1: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 6,
  },
  recordView: {
    flex: 1,
    marginTop: 15,
  },
  recordText2: {
    fontSize: 13,
    marginTop: 15,
    color: "grey",
  },
  voiceButton: {
    flexDirection: "row",
    flex: 1,
    width: SCREEN_WIDTH - 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: "lightgrey",
    marginTop: 15,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "grey",
  },
  place: {
    flex: 1,
    backgroundColor: "grey",
    marginRight: 12,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  placeText: { fontSize: 14, color: "white" },
  voiceContent: { flex: 4.5, justifyContent: "center" },
  voiceTime: { fontSize: 16, fontWeight: "500", color: "black" },
  voiceText: { fontSize: 13 },
});
