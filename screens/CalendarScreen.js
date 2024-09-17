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
import { Calendar } from "react-native-calendars";
import { FontAwesome } from "@expo/vector-icons";
import Left from "../assets/chevron_left.svg";
import Right from "../assets/chevron_right.svg";
import Edit_white from "../assets/notes_white.svg";
import { WithLocalSvg } from "react-native-svg/css";
import { useEffect, useState } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width; // 화면 가로 크기

export default function CalendarScreen({ navigation }) {
  const norecord = useState(true); // 기록 유무
  const daysOfWeek = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const today = new Date().toLocaleDateString("sv-SE"); // 오늘 날짜
  const [selectedDate, setSelectedDate] = useState(today); // 달력 시작날짜 -> today
  const [currentMonth, setcurrentMonth] = useState(new Date().getMonth()); // 현재 캘린더 월-1

  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={0.5} style={styles.headerTab}>
            <Text style={{ ...styles.subTitle, color: theme.green500 }}>
              캘린더
            </Text>
          </TouchableOpacity>
          <LinearGradient colors={["#79BA7E", "#AFCA85"]}>
            <View style={{ height: 4, backgroundColor: "transperant" }} />
          </LinearGradient>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={0.5} style={styles.headerTab}>
            <Text style={{ ...styles.subTitle, color: theme.grey300 }}>
              통계
            </Text>
          </TouchableOpacity>
          <View style={{ height: 4, backgroundColor: theme.grey100 }} />
        </View>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar
          current={selectedDate}
          // 헤더 커스터마이징
          customHeader={(props) => {
            // props 제공 -> month(Date 객체), addMonth(달 이동)
            const month = props.month;
            const year = month.getFullYear(); // 연도
            const monthNumber = month.getMonth() + 1;
            const header = `${year}년 ${monthNumber}월`;

            return (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 18,
                    marginBottom: 8,
                    marginHorizontal: 11,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      props.addMonth(-1);
                    }}
                  >
                    <WithLocalSvg asset={Left} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      lineHeight: 24,
                      fontFamily: "Pretendard-Bold",
                      color: theme.grey700,
                    }}
                  >
                    {header}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => props.addMonth(1)}
                  >
                    <WithLocalSvg asset={Right} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  {["일", "월", "화", "수", "목", "금", "토"].map(
                    (day, index) => (
                      <View
                        key={index}
                        style={{
                          width: 45,
                          height: 45,
                          alignItems: "center",
                          justifyContent: "center",
                          marginHorizontal: 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            lineHeight: 24,
                            fontFamily: "Pretendard-Bold",
                            color: theme.grey800,
                          }}
                        >
                          {day}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            );
          }}
          // 날짜 커스터마이징
          dayComponent={({ date, state }) => {
            // const isToday = date.dateString === today;
            // const isDisabled = state === "disabled";
            const isSelected = date.dateString === selectedDate;
            const isFuture = new Date(date.dateString) > new Date(today); // 미래인지 확인

            return (
              <View style={styles.dayContainer}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    setSelectedDate(date.dateString);
                  }}
                  disabled={isFuture}
                  style={[
                    styles.dayColor,
                    isSelected && { backgroundColor: theme.green600 },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 20,
                      fontFamily: isSelected
                        ? "Pretendard-Bold"
                        : "Pretendard-Regular",
                      color: isSelected
                        ? "white"
                        : isFuture
                        ? theme.grey300
                        : theme.grey700,
                    }}
                  >
                    {date.day}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
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
                {new Date(selectedDate).getMonth() + 1}.
                {new Date(selectedDate).getDate()}{" "}
                {daysOfWeek[new Date(selectedDate).getDay()]}{" "}
                {selectedDate == today && "(오늘)"}
              </Text>
              <FontAwesome
                name="circle"
                size={20}
                color={norecord ? "transparent" : theme.yellow}
              />
            </View>
            {!norecord && <Text style={styles.dubogi}>더보기</Text>}
          </View>
          <View style={styles.line} />
          {norecord ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              <Text
                style={{
                  ...styles.norecordText,
                  marginBottom: 16,
                }}
              >
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
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    navigation.navigate("SymptomCheck", { date: selectedDate });
                  }}
                  style={styles.button}
                >
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
          ) : (
            <>
              <View style={{ flexDirection: "row", marginVertical: 12 }}>
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
              <Text style={{ ...styles.norecordText, color: theme.grey800 }}>
                {summaryText && summaryText !== ""
                  ? summaryText.slice(0, 92).replace(/\n/g, " ")
                  : totalText.slice(0, 92).replace(/\n/g, " ")}
                ...
              </Text>
            </>
          )}
        </TouchableOpacity>
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
  },
  calendar: {
    flex: 1,
  },
  dayContainer: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: -6,
  },
  dayColor: {
    width: 39,
    height: 39,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  recordContainer: {
    width: "100%",
    height: 223,
    padding: 12,
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
    fontFamily: "Human-beomseok",
  },
  photo: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "transparent",
  },
});
