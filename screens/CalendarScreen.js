import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { Shadow } from "react-native-shadow-2";
import { Calendar } from "react-native-calendars";
import Entypo from "@expo/vector-icons/Entypo";
import { FontAwesome } from "@expo/vector-icons";
import NoRecord from "../assets/norecord.svg";
import Edit_white from "../assets/notes_white.svg";
import { WithLocalSvg } from "react-native-svg/css";
import { useState } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width; // 화면 가로 크기

export default function CalendarScreen({ navigator }) {
  const norecord = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerTab}>
            <Text style={{ ...styles.subTitle, color: theme.green500 }}>
              캘린더
            </Text>
          </View>
          <LinearGradient colors={["#79BA7E", "#AFCA85"]}>
            <View style={{ height: 4, backgroundColor: "transperant" }} />
          </LinearGradient>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.headerTab}>
            <Text style={{ ...styles.subTitle, color: theme.grey300 }}>
              그래프
            </Text>
          </View>
          <View style={{ height: 4, backgroundColor: theme.grey100 }} />
        </View>
      </View>
      {/* <View style={styles.month}>
        <Entypo name="chevron-small-left" size={25} color={theme.grey500} />
        <Text style={{ ...styles.title, color: theme.grey700 }}>
          2024년 8월
        </Text>
        <Entypo name="chevron-small-right" size={25} color={theme.grey500} />
      </View> */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.calendarContainer}>
          <Calendar
            // 일요일부터 시작하도록 설정
            firstDay={0}
            theme={{
              todayTextColor: theme.green500,
              arrowColor: theme.grey500,
              textDayFontFamily: "Pretendard-Regular",
              textMonthFontFamily: "Pretendard-Bold",
              textDayHeaderFontFamily: "Pretendard-Bold",

              // 간격 및 스타일 조정
              dayTextStyle: {
                fontSize: 14, // 날짜 텍스트 크기
                paddingVertical: 12.5, // 날짜 상하 간격
                paddingHorizontal: 15, // 날짜 좌우 간격
              },
              textDayHeaderFontSize: 12, // 요일 텍스트 크기
            }}
            // 월 변경 화살표 커스터마이징
            renderArrow={(direction) => (
              <Entypo
                name={
                  direction === "left"
                    ? "chevron-small-left"
                    : "chevron-small-right"
                }
                size={25}
                color={theme.grey500}
              />
            )}
            markingType={"period"}
            style={styles.calendar}
          />
        </View>
        <View style={styles.recordContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.record}
            disabled={norecord ? true : false}
          >
            <View style={styles.recordHeader}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    ...styles.subTitle,
                    marginRight: 8,
                    color: theme.grey700,
                  }}
                >
                  8.15 목요일 (오늘)
                </Text>
                <FontAwesome name="circle" size={20} color={theme.yellow} />
              </View>
              <Text style={styles.dubogi}>더보기</Text>
            </View>
            <View style={styles.line} />
            {/* <View style={{ flexDirection: "row", marginVertical: 10 }}>
              {images.map((image) => (
                <View key={image.id}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </View>
            <Text style={styles.recordText}>
              {summaryText && summaryText !== ""
                ? summaryText.slice(0, 92).replace(/\n/g, " ")
                : totalText.slice(0, 92).replace(/\n/g, " ")}
              ...
            </Text> */}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 20,
              }}
            >
              <WithLocalSvg asset={NoRecord} />
              <Text style={styles.norecordText}>
                {"아직 기록하지 않았어요!"}
              </Text>
              <LinearGradient
                colors={["#79BA7E", "#AFCA85"]}
                style={{
                  ...styles.button,
                  paddingHorizontal: 36,
                  paddingVertical: 12,
                }}
              >
                <TouchableOpacity activeOpacity={0.5} style={styles.button}>
                  <WithLocalSvg asset={Edit_white} />
                  <Text
                    style={{
                      ...styles.subTitle,
                      marginLeft: 8,
                      fontFamily: "Pretendard-Medium",
                      color: "white",
                    }}
                  >
                    {"하루기록"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: 40,
    marginTop: 10,
  },
  headerTab: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  month: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    color: theme.grey800,
  },
  calendarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  calendar: {
    flex: 1,
    width: "100%",
  },
  recordContainer: {
    width: SCREEN_WIDTH,
    height: 257,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: theme.grey100,
  },
  record: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "white",
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Bold",
  },
  dubogi: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Pretendard-Bold",
    color: theme.grey400,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: theme.grey250,
  },
  norecordText: {
    alignItems: "center",
    justifyContent: "center",
    color: theme.grey500,
    fontSize: 14,
    lineHeight: 19.6,
    marginTop: 10,
    marginBottom: 16,
    fontFamily: "Human-beomseok",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "transparent",
  },
});
