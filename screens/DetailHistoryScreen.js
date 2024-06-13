import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import VoiceButton from "../component/VoiceButton";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Note from "../assets/notes.svg";
import Check from "../assets/check.svg";
import DropDown from "../assets/keyboard_arrow_down.svg";
import DropUp from "../assets/keyboard_arrow_up.svg";
import Home from "../assets/home_green.svg";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import summary from "./SummaryAPI";

export default function DetailHistoryScreen({ navigation }) {
  // 상세 기록 state
  const [homeText, setHomeText] = useState("");
  const [schoolText, setSchoolText] = useState("");
  const [hospitalText, setHospitalText] = useState("");
  const [images, setImages] = useState([]);
  const [date, setDate] = useState("");

  const [remindVisible, setRemindVisible] = useState(false); // 되돌아보기 드롭다운 활성화
  const [totalText, setTotalText] = useState(""); // 서머리 요약을 위한 전체 텍스트
  const [summaryText, setSummaryText] = useState(""); // 서머리  결과

  // 수정하고 돌아왔을때 다시 실행되게 useFocusEffect
  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const rawRecord = await AsyncStorage.getItem("2024-06-13");
          const newRecord = JSON.parse(rawRecord);

          setHomeText(newRecord.home);
          setSchoolText(newRecord.school);
          setHospitalText(newRecord.hospital);
          setImages(newRecord.image);
          setDate(newRecord.date);

          // totalText
          let newTotalText = "";
          if (newRecord.home) {
            newTotalText += newRecord.home;
          }
          if (newRecord.school) {
            newTotalText += ` ${newRecord.school}`;
          }
          if (newRecord.hospital) {
            newTotalText += ` ${newRecord.hospital}`;
          }
          setTotalText(newTotalText);

          console.log(newTotalText);
          console.log(newRecord);
        } catch (e) {
          console.log("기록 로드 에러");
        }
      }
      load();
      console.log(`전체 텍스트: ${totalText}`);
    }, [])
  );

  // 네이버 summary api
  useFocusEffect(
    useCallback(() => {
      const handleSummary = async () => {
        try {
          const result = await summary(totalText);
          setSummaryText(result.summary);
          console.log(result.summary);
        } catch (error) {
          console.log("서머리 에러", error.response.data.error.errorCode);
        }
      };

      if (totalText) {
        handleSummary();
      }
    }, [totalText])
  );

  return (
    <>
      <Header
        left="leftArrow"
        title={`${new Date(date).getMonth() + 1}월 ${new Date(
          date
        ).getDate()}일`}
        right="수정"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={() => {
          navigation.push("DetailModify", { date: date });
        }}
        iconColor={theme.green500}
        line={true}
      />
      <ScrollView style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScroll}
        >
          {images.map((image) => (
            <View key={image.id}>
              <Image
                source={{ uri: image.uri }}
                style={styles.photo}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.subContainer}>
          <View style={{ marginVertical: 24 }}>
            <View style={{ flexDirection: "row", marginBottom: 12 }}>
              <WithLocalSvg width={20} height={20} asset={Note} />
              <Text style={styles.title}>기록을 요약했어요</Text>
            </View>
            <Text style={styles.subText}>{summaryText}</Text>
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
              <Text style={styles.recordText}>{homeText}</Text>
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
              <Text style={styles.recordText}>{hospitalText}</Text>
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
    fontFamily: "Pretendard-Medium",
    color: theme.grey600,
  },
  subText: {
    fontSize: 14,
    color: theme.grey700,
    fontFamily: "Human-beomseok",
    lineHeight: 19.6,
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
    fontFamily: "Pretendard-Regular",
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
    fontFamily: "Pretendard-Medium",
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
