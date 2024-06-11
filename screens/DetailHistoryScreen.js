import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import VoiceButton from "../component/VoiceButton";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Note from "../assets/notes.svg";
import Check from "../assets/check.svg";
import DropDown from "../assets/keyboard_arrow_down.svg";
import DropUp from "../assets/keyboard_arrow_up.svg";
import Home from "../assets/home.svg";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import { FontAwesome } from "@expo/vector-icons";

export default function DetailHistoryScreen({ navigation }) {
  // 상세 기록 state
  const [homeText, setHomeText] = useState(" ");
  const [schoolText, setSchoolText] = useState("");
  const [hospitalText, setHospitalText] = useState(" ");

  // 되돌아보기 드롭다운 활성화
  const [remindVisible, setRemindVisible] = useState(false);

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
          navigation.push("DetailModify");
        }}
        iconName={School}
        line={true}
      />
      <ScrollView style={styles.container}>
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
        <View style={styles.subContainer}>
          <View style={{ marginVertical: 24 }}>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <WithLocalSvg width={20} height={20} asset={Note} />
              <Text style={styles.title}>기록을 요약했어요</Text>
            </View>
            <Text style={styles.subText}>
              기록을요약했대어쩌구우리아이가어땠대어쩌구기록요약어쩌구기록을요약했대어쩌구우리아이가어땠대어쩌구기록요약어쩌구기록을요약했대어쩌구우리아이가어땠대어쩌구기록요약어쩌구
            </Text>
          </View>
        </View>

        <View style={styles.line} />
        <View
          style={{
            paddingVertical: 16,
          }}
        >
          <View style={styles.remind}>
            <View style={{ flexDirection: "row" }}>
              <WithLocalSvg width={23} height={23} asset={Check} />
              <Text style={{ ...styles.title, marginLeft: 5 }}>되돌아보기</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setRemindVisible(!remindVisible)}
            >
              {!remindVisible ? (
                <WithLocalSvg width={24} height={24} asset={DropDown} />
              ) : (
                <WithLocalSvg width={24} height={24} asset={DropUp} />
              )}
            </TouchableOpacity>
          </View>
          {remindVisible ? (
            <View style={{ marginTop: 12, paddingHorizontal: 24 }}>
              <View style={styles.subRemind}>
                <FontAwesome name="circle" size={6} color={theme.green300} />
                <Text style={styles.remindText}>
                  아이의 사소한 실수는 눈 감아주었어요
                </Text>
              </View>
              <View style={styles.subRemind}>
                <FontAwesome name="circle" size={6} color={theme.green300} />
                <Text style={styles.remindText}>
                  아이에게 천천히 설명했어요
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <View style={styles.line} />
        <View style={styles.space} />
        <View style={{ ...styles.subContainer, paddingTop: 16 }}>
          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={Home} />
            <Text style={styles.inputGuideText}>가정에서 어땠나요?</Text>
          </View>
          <View style={styles.recordView}>
            {homeText === "" ? (
              <Text style={{ ...styles.recordText, color: theme.grey500 }}>
                상세기록을 하지 않았어요{"\n"}
              </Text>
            ) : (
              <Text style={styles.recordText}>
                아침에 일어나기 어려워함. 기상 후에도 집중력이 부족해 아침
                준비가 늦어짐. 저녁 식사 중간에 계속 자리를 떠서 여러 번 주의를
                줌. 식사후 설거지를 도와주었음. 숙제를 할 때 집중하지 못하고
                자주 딴짓을 해서 함께 앉아 도와주며 완료함.
              </Text>
            )}
          </View>
          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={School} />
            <Text style={styles.inputGuideText}>학교에서 어땠나요?</Text>
          </View>
          <View style={styles.recordView}>
            {schoolText === "" ? (
              <Text style={{ ...styles.recordText, color: theme.grey500 }}>
                상세기록을 하지 않았어요{"\n"}
              </Text>
            ) : (
              <Text style={styles.recordText}>{schoolText}</Text>
            )}
          </View>
          <VoiceButton
            onPress={() =>
              navigation.navigate("DetailVoice", {
                detail: true,
              })
            }
          />
          <View style={{ ...styles.subTextContainer, marginTop: 12 }}>
            <WithLocalSvg width={20} height={20} asset={Hospital} />
            <Text style={styles.inputGuideText}>병원에서 어땠나요?</Text>
          </View>
          <View style={styles.recordView}>
            {hospitalText === "" ? (
              <Text style={{ ...styles.recordText, color: theme.grey500 }}>
                상세기록을 하지 않았어요{"\n"}
              </Text>
            ) : (
              <Text style={styles.recordText}>
                오늘은 ADHD 정기 검진 날. 의사와 상담 후 약물 조정이 필요하다고
                판단됨. 의사 선생님이 추천해준 행동치료 프로그램에 등록하기로
                결정함. 치료 계획에 대해 상담하고 가정에서 할 수 있는 행동 관리
                방법에 대해 교육 받음.
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 70 }} />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 28,
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },

  photoScroll: { marginLeft: 24 },
  photo: {
    width: 75,
    height: 75,
    borderRadius: 8,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  title: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: theme.grey600,
  },
  subText: {
    fontSize: 14,
    color: theme.grey700,
    fontFamily: "Human-beomseok",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: theme.grey150,
  },
  remind: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  subRemind: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  remindText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "400",
    color: theme.grey800,
  },
  space: {
    width: "100%",
    height: 8,
    backgroundColor: "#F8F8F8",
  },
  subTextContainer: {
    flexDirection: "row",
    marginBottom: 12,
    marginTop: 8,
    alignItems: "center",
  },
  inputGuideText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
    color: theme.grey600,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.green50,
    textAlignVertical: "top",
  },
  recordView: {
    flex: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: theme.green50,
  },
  recordText: {
    fontSize: 14,
    color: theme.grey800,
    fontFamily: "Human-beomseok",
    lineHeight: 19.6,
  },
});
