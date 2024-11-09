import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";
import { FontAwesome } from "@expo/vector-icons";
import Left from "../assets/chevron_left.svg";
import Right from "../assets/chevron_right.svg";
import RightGray from "../assets/chevron_right_gray.svg";
import Edit_white from "../assets/notes_white.svg";
import { WithLocalSvg } from "react-native-svg/css";
import { useEffect, useState, useCallback } from "react";
import GraphScreen from "./GraphScreen";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import PlusBtn from "../component/PlusBtn";

export default function CalendarScreen({ navigation, route }) {
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
  const [isCalendar, setIsCalendar] = useState(true); // true : 캘린더, false : 통계
  const [dayStates, setDayStates] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date(today).getFullYear());
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today).getMonth() + 1
  );
  const [record, setRecord] = useState(null);
  const [images, setImages] = useState([]);
  const { ipnumber, user_code } = route.params;

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const response = await axios.get(
            `http://${ipnumber}:8080/daily/records/${user_code}/${selectedDate}`
          );
          // console.log(response.data);
          setRecord(response.data);

          // 이미지 가져옴
          const response_image = await axios.get(
            `http://${ipnumber}:8080/image/show/${user_code}/${selectedDate}`
          );
          console.log("이미지 로드: ", response_image.data);
          if (response_image) {
            setImages(response_image.data);
          }
        } catch (error) {
          console.log("선택 날짜 GET: ", error);
        }
      };
      load();
      console.log("선택 날짜 : ", selectedDate);
    }, [selectedDate])
  );

  useEffect(() => {
    load();
  }, [currentMonth]);

  // 기록 로드
  // 이전/현재/다음 달 전부 로드(앞뒤로 이전/다음달이 보일때가 있음)
  const load = async () => {
    try {
      const yearMonth = `${currentYear}-${String(currentMonth).padStart(
        2,
        "0"
      )}`;
      const beforeYearMonth =
        currentMonth == 1
          ? `${currentYear - 1}-12`
          : `${currentYear}-${String(currentMonth - 1).padStart(2, "0")}`;
      const afterYearMonth =
        currentMonth == 12
          ? `${currentYear + 1}-01`
          : `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;

      console.log(`${beforeYearMonth} ${yearMonth} ${afterYearMonth}`);

      const responseDates = [];

      const beforeResponse = await axios.get(
        `http://${ipnumber}:8080/daily/state/${user_code}/${beforeYearMonth}`
      );
      responseDates.push(...beforeResponse.data);

      const response = await axios.get(
        `http://${ipnumber}:8080/daily/state/${user_code}/${yearMonth}`
      );
      responseDates.push(...response.data);

      const afterResponse = await axios.get(
        `http://${ipnumber}:8080/daily/state/${user_code}/${afterYearMonth}`
      );
      responseDates.push(...afterResponse.data);

      //console.log("GET: ", responseDates);
      setDayStates(responseDates);
    } catch (error) {
      console.log("GET 에러: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isCalendar ? (
        <>
          {/* 헤더 */}
          <View style={styles.header}>
            <View>
              <TouchableOpacity activeOpacity={0.5} style={styles.headerTab}>
                <Text
                  style={{
                    ...styles.subTitle,
                    marginHorizontal: 11,
                    color: theme.green500,
                  }}
                >
                  캘린더
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: 58,
                  height: 4,
                  borderRadius: 8,
                  backgroundColor: theme.green500,
                }}
              />
            </View>
            <View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setIsCalendar(false)}
                style={styles.headerTab}
              >
                <Text
                  style={{
                    ...styles.subTitle,
                    marginHorizontal: 17,
                    color: theme.grey300,
                  }}
                >
                  분석
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: 58,
                  height: 4,
                  borderRadius: 8,
                  backgroundColor: "transparent",
                }}
              />
            </View>
          </View>

          {/* 캘린더 */}
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onMonthChange={(date) => {
                const newYear = date.year;
                const newMonth = date.month;

                setCurrentYear(newYear);
                setCurrentMonth(newMonth);
              }}
              // 헤더 커스터마이징
              customHeader={(props) => {
                // props 제공 -> month(Date 객체), addMonth(달 이동)
                const month = props.month;
                const year = month.getFullYear(); // 연도
                const monthNumber = month.getMonth() + 1;
                const header = `${year}년 ${monthNumber}월`;
                const current = new Date(today);

                const isFuture =
                  current.getFullYear() == year &&
                  current.getMonth() + 1 == monthNumber;

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
                        disabled={isFuture}
                      >
                        {isFuture ? (
                          <WithLocalSvg asset={RightGray} />
                        ) : (
                          <WithLocalSvg asset={Right} />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
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
                const isDisabled = state === "disabled"; // 이전/다음 달 날짜
                const isSelected = date.dateString === selectedDate;
                const isFuture = new Date(date.dateString) > new Date(today); // 미래인지 확인

                // 현재 날짜에 대한 상태 찾기
                const dayState = dayStates?.find(
                  (day) => day.date === date.dateString
                );

                let dayColor = "transparent";
                if (dayState) {
                  switch (dayState.state) {
                    case 0:
                      dayColor = theme.pink;
                      break;
                    case 1:
                      dayColor = theme.yellow;
                      break;
                    case 2:
                      dayColor = theme.green;
                      break;
                    default:
                      dayColor = "transparent";
                  }
                }

                return (
                  <View style={styles.dayContainer}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        setSelectedDate(date.dateString);
                      }}
                      disabled={isFuture}
                      style={[
                        styles.selectedDay,
                        isSelected && { backgroundColor: theme.green500 },
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
                            : isFuture || isDisabled
                            ? theme.grey300
                            : theme.grey700,
                        }}
                      >
                        {date.day}
                      </Text>
                      <View
                        style={[styles.dayColor, { backgroundColor: dayColor }]}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
              style={styles.calendar}
            />
          </View>
          {/* 하루 기록 */}
          <View style={styles.recordContainer}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.record}
              disabled={record ? false : true}
              onPress={() =>
                navigation.push("DetailHistory", {
                  date: selectedDate,
                  user_code: user_code,
                  ipnumber: ipnumber,
                })
              }
            >
              <View style={styles.recordHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      ...styles.subTitle,
                      marginRight: 6,
                      color: theme.grey700,
                    }}
                  >
                    {new Date(selectedDate).getMonth() + 1}월{" "}
                    {new Date(selectedDate).getDate()}일{" "}
                    {/* {daysOfWeek[new Date(selectedDate).getDay()]}{" "} */}
                    {selectedDate == today && "(오늘)"}
                  </Text>
                  <FontAwesome
                    name="circle"
                    size={20}
                    color={
                      record
                        ? record.state == 2
                          ? theme.green
                          : record.state == 1
                          ? theme.yellow
                          : theme.pink
                        : "transparent"
                    }
                  />
                </View>
                {record && <Text style={styles.dubogi}>더보기</Text>}
              </View>
              <View style={styles.line} />
              {!record ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 12,
                  }}
                >
                  <PlusBtn
                    onPress={() => {
                      navigation.navigate("SymptomCheck", {
                        date: selectedDate,
                        user_code: user_code,
                        ipnumber: ipnumber,
                      });
                    }}
                  />
                </View>
              ) : (
                <View>
                  <ScrollView
                    contentContainerStyle={{
                      flexDirection: "row",
                      marginVertical: 12,
                    }}
                  >
                    {images.length > 0 ? (
                      images.map((image, index) => (
                        <View key={index}>
                          <Image
                            source={{
                              uri: `${image}`,
                            }}
                            style={styles.photo}
                            resizeMode="cover"
                          />
                        </View>
                      ))
                    ) : (
                      <View
                        style={[
                          styles.photo,
                          { backgroundColor: theme.grey150 },
                        ]}
                      />
                    )}
                  </ScrollView>
                  <Text
                    style={{
                      ...styles.norecordText,
                      color: theme.grey800,
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {(record.summary || "").replace(/\n/g, " ")}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <GraphScreen
          user_code={user_code}
          ipnumber={ipnumber}
          setIsCalendar={setIsCalendar}
        />
      )}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 78,
    borderBottomWidth: 1,
    borderColor: "#EBEBEB",
  },
  headerTab: {
    height: 36,
    justifyContent: "center",
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
    marginVertical: -5,
  },
  selectedDay: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 7,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  dayColor: {
    width: 7,
    height: 7,
    marginTop: 1.6,
    borderRadius: 30,
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
