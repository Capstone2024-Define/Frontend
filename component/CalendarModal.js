import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Calendar } from "react-native-calendars";
import { WithLocalSvg } from "react-native-svg/css";
import Left from "../assets/chevron_left.svg";
import Right from "../assets/chevron_right.svg";
import axios from "axios";
import { theme } from "../colors/color";

// 홈 캘린더 모달
export default function CalendarModal({
  visible,
  onClose,
  currentDate,
  setHomeSelectedDate,
  user_code,
  ipnumber,
}) {
  const today = new Date().toLocaleDateString("sv-SE"); // 오늘 날짜
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const slideAnim = useRef(new Animated.Value(300)).current; // 애니메이션
  const [dayStates, setDayStates] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date(today).getFullYear());
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today).getMonth() + 1
  );

  // 애니메이션
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // 모달이 열릴 때마다 selectedDate를 current로 초기화
  useEffect(() => {
    if (visible) {
      setSelectedDate(currentDate);
    }
  }, [visible]);

  useEffect(() => {
    load();
  }, [visible]);

  // 기록 로드
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
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={theme.modalBackground}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
            >
              <View style={styles.calendarContainer}>
                <Calendar
                  current={selectedDate ? selectedDate : today}
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

                    return (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
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
                    const isFuture =
                      new Date(date.dateString) > new Date(today); // 미래인지 확인

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
                          disabled={isFuture}
                          onPress={() => {
                            console.log("캘린더 선택 날짜: ", date.dateString);
                            setHomeSelectedDate(date.dateString);
                            onClose();
                          }}
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
                                : isFuture
                                ? theme.grey300
                                : theme.grey700,
                            }}
                          >
                            {date.day}
                          </Text>
                          <View
                            style={[
                              styles.dayColor,
                              { backgroundColor: dayColor },
                            ]}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  style={styles.calendar}
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: 358,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  calendarContainer: {
    flex: 1,
    alignItems: "center",
  },
  calendar: {
    flex: 1,
    marginBottom: 4,
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
    backgroundColor: "transparent",
  },
});
