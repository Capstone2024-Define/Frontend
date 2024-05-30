import { StyleSheet, View, Text, ScrollView, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import VoiceButton from "../component/VoiceButton";
import SmallTag from "../component/SmallTag";
import Header from "../component/Header";

// Dimensions로 화면 크기 가져오기
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function RecordHistory({ navigation }) {
  return (
    <>
      <Header
        left="leftArrow"
        title="0월 0일"
        right="수정"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={() => {
          navigation.push("RecordModify");
        }}
        line={true}
      />
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
            <SmallTag text="불순응" />
            <SmallTag text="끼어들기" />
            <SmallTag text="고자질" />
            <SmallTag text="자기연민" />
            <SmallTag text="불순응" />
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
            <VoiceButton onPress={() => navigation.navigate("DetailVoice")} />
            <View style={{ marginBottom: 96 }}></View>
          </View>
        </View>
      </ScrollView>
    </>
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
  photoScroll: { marginTop: 15 },
  photo: {
    width: 75,
    height: 75,
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
});
