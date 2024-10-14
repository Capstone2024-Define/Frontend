import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Image,
  BackHandler,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import Header from "../component/Header";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../colors/color";
import Feather from "@expo/vector-icons/Feather";
import { WithLocalSvg } from "react-native-svg/css";
import CalendarImg from "../assets/calender.svg";
import { useLayoutEffect } from "react";
import { Calendar } from "react-native-calendars";
import Left from "../assets/chevron_left.svg";
import Right from "../assets/chevron_right.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const SCREEN_WIDTH = Dimensions.get("window").width;

// 캘린더 모달
const CalendarModal = ({
  visible,
  onClose,
  currentDate,
  calendarNum,
  startDate,
  setStartDate,
  setEndDate,
  user_code,
  ipnumber,
}) => {
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
  }, [currentMonth]);

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
                    const isBeforeStart =
                      new Date(date.dateString) < new Date(startDate); // 시작일자 이후인지 확인

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
                          disabled={
                            isFuture || (calendarNum == 2 && isBeforeStart)
                          }
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
                                : isFuture ||
                                  (calendarNum == 2 && isBeforeStart)
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
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    !selectedDate
                      ? onClose()
                      : calendarNum == 1
                      ? setStartDate(selectedDate)
                      : setEndDate(selectedDate);
                    onClose();
                  }}
                >
                  <LinearGradient
                    colors={["#79BA7E", "#AFCA85"]}
                    style={styles.button}
                  >
                    <View
                      style={[
                        styles.button,
                        { backgroundColor: theme.grey200 },
                        selectedDate && { backgroundColor: "transparent" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.buttonText,
                          { color: theme.grey400 },
                          selectedDate && { color: "white" },
                        ]}
                      >
                        {selectedDate
                          ? `${
                              new Date(selectedDate).getMonth() + 1
                            }월 ${new Date(selectedDate).getDate()}일 (${
                              ["일", "월", "화", "수", "목", "금", "토"][
                                new Date(selectedDate).getDay()
                              ]
                            }) 선택`
                          : "닫기"}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// 스크린 화면
export default function ExportRecordScreen({ navigation, route }) {
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [visible, setVisible] = useState(false); // 모달 상태
  const [calendarNum, setCalendarNum] = useState(null);
  const { ipnumber, user_code } = route.params;

  // 키보드 활성화 시 감지
  useLayoutEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // 휴대폰 뒤로가기 버튼 커스터마이징
  useEffect(() => {
    const backAction = () => {
      if (page === 0 || page === 3) {
        navigation.pop();
      } else if (page === 1) {
        setPage(0);
      } else if (page === 2) {
        setPage(1);
      }
      return true; // 뒤로 가기 이벤트를 막고 우리가 설정한 동작 실행
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 제거
  }, [page]);

  useEffect(() => {
    console.log("시작 날짜: ", startDate);
    console.log("종료 날짜: ", endDate);
  }, [startDate, endDate]);

  // // 이메일 유효성 체크
  // useEffect(() => {
  //   setIsValidEmail(validateEmail(email));
  //   console.log("이메일: ", email);
  // }, [email]);

  // // 이메일 유효성 체크
  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  const textToPdf = async (text) => {
    setTimeout(async () => {
      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          </head>
          <body style="text-align: center;">
            <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
              ${text}
            </h1>
            <img
              src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
              style="width: 90vw;" />
          </body>
        </html>
        `;
      const { uri } = await Print.printToFileAsync({
        html,
        fileName: "Clobit.pdf",
      });
      console.log("File has been saved to:", uri);

      try {
        const result = await shareAsync(uri, {
          UTI: ".pdf",
          mimeType: "application/pdf",
        });
        console.log(result);
        setPage(3);
      } catch (error) {
        console.error("파일 공유 실패 :", error);
        setPage(1);
      }
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        left={page == 3 ? null : "leftArrow"}
        title="기록 내보내기"
        onLeftPress={() => {
          page == 0 ? navigation.pop() : page == 1 ? setPage(0) : setPage(1);
        }}
      />
      {page == 0 ? (
        // ***0번째 페이지***
        <View style={{ ...styles.subContainer, alignItems: "center" }}>
          <View style={styles.imageContainer}>
            <View style={styles.phone} />
            <LinearGradient
              colors={["transparent", "#00000005", "#00000010"]}
              style={styles.shadowGradient}
            />
          </View>
          <Text style={{ ...styles.boldText, marginTop: 24, marginBottom: 4 }}>
            기록한 내용을 PDF로 공유 받으세요
          </Text>
          <Text style={styles.subText}>
            기록했던 내용을 정리해서 메일로 보내드려요
          </Text>
        </View>
      ) : page !== 3 ? (
        // ***1,2번째 페이지***
        <View style={styles.subContainer}>
          <View
            style={{ flexDirection: "row", marginTop: 20, marginBottom: 24 }}
          >
            <View
              style={[
                styles.circle,
                page == 2 && { backgroundColor: theme.grey200 },
                { marginRight: 16 },
              ]}
            >
              <Text style={styles.number}>
                {page == 1 ? (
                  1
                ) : (
                  <Feather name="check" size={18} color="white" />
                )}
              </Text>
            </View>
            <View
              style={[
                styles.circle,
                page == 1 && { backgroundColor: theme.grey200 },
                { marginRight: 16 },
              ]}
            >
              <Text style={styles.number}>2</Text>
            </View>
          </View>
          <Text style={{ ...styles.title, marginBottom: 20 }}>
            {page == 1
              ? `불러올 기록의 범위를${"\n"}선택해주세요`
              : `기록을 내보낼 곳을${"\n"}선택해주세요`}
          </Text>
          {page == 1 ? (
            <View>
              <Text style={styles.subTitle}>시작날짜</Text>
              <View
                style={[
                  styles.input,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                  startDate && {
                    backgroundColor: theme.green50,
                    borderColor: theme.green500,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.inputText,
                    startDate
                      ? { color: theme.grey900 }
                      : { color: theme.grey400 },
                  ]}
                >
                  {startDate
                    ? `${new Date(startDate).getFullYear()} / ${
                        new Date(startDate).getMonth() + 1
                      } / ${new Date(startDate).getDate()}`
                    : "YYYY / MM / DD"}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    setCalendarNum(1);
                    setVisible(true);
                  }}
                >
                  <WithLocalSvg asset={CalendarImg} />
                </TouchableOpacity>
              </View>
              <Text style={{ ...styles.subTitle, marginTop: 12 }}>
                종료날짜
              </Text>
              <View
                style={[
                  styles.input,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                  endDate && {
                    backgroundColor: theme.green50,
                    borderColor: theme.green500,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.inputText,
                    endDate
                      ? { color: theme.grey900 }
                      : { color: theme.grey400 },
                  ]}
                >
                  {endDate
                    ? `${new Date(endDate).getFullYear()} / ${
                        new Date(endDate).getMonth() + 1
                      } / ${new Date(endDate).getDate()}`
                    : "YYYY / MM / DD"}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    setCalendarNum(2);
                    setVisible(true);
                  }}
                >
                  <WithLocalSvg asset={CalendarImg} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // <View>
            //   <Text style={styles.subTitle}>이메일</Text>
            //   <TextInput
            //     placeholder="example@naver.com"
            //     style={[
            //       styles.input,
            //       email.length > 0 &&
            //         isValidEmail && { backgroundColor: theme.green50 },
            //       email.length > 0 &&
            //         isValidEmail &&
            //         !isKeyboardVisible && { borderColor: theme.green500 },
            //       email.length > 0 &&
            //         !isValidEmail &&
            //         !isKeyboardVisible && { borderColor: theme.red },
            //     ]}
            //     placeholderTextColor={theme.grey400}
            //     onChangeText={setEmail}
            //     returnKeyType="done"
            //     value={email}
            //     keyboardType="email-address"
            //   />
            // </View>
            textToPdf()
          )}
        </View>
      ) : (
        // ***3번째 페이지***
        <View
          style={{
            ...styles.subContainer,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image source={require("../assets/hi_rabbit.png")} />
          <Text style={{ ...styles.boldText, marginTop: 22, marginBottom: 4 }}>
            기록을 보내드렸어요!
          </Text>
          <Text style={{ ...styles.subText, color: theme.grey600 }}>
            공유하기로 내보낸 파일을 확인해주세요!
          </Text>
        </View>
      )}
      {/* ***아래 버튼*** */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {!isKeyboardVisible && page !== 2 && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              page == 0
                ? setPage(1)
                : page == 1
                ? setPage(2)
                : // : page == 2
                  // ? setPage(3)
                  navigation.pop();
            }}
            disabled={
              (page == 1 && !(startDate && endDate)) ||
              (page == 2 && !isValidEmail)
            }
            style={{ marginBottom: 20 }}
          >
            <LinearGradient
              colors={["#79BA7E", "#AFCA85"]}
              style={styles.button}
            >
              <View
                style={[
                  styles.button,
                  { backgroundColor: theme.grey250 },
                  (page == 0 || page == 3) && {
                    backgroundColor: "transparent",
                  },
                  page == 1 &&
                    startDate &&
                    endDate && { backgroundColor: "transparent" },
                  page == 2 &&
                    isValidEmail && { backgroundColor: "transparent" },
                ]}
              >
                <Text style={styles.buttonText}>
                  {page == 0
                    ? "시작하기"
                    : page == 1
                    ? "다음"
                    : page == 2
                    ? "내보내기"
                    : "완료"}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      <CalendarModal
        visible={visible}
        onClose={() => setVisible(false)}
        currentDate={calendarNum == 1 ? startDate : endDate}
        calendarNum={calendarNum}
        startDate={startDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        user_code={user_code}
        ipnumber={ipnumber}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 24,
    backgroundColor: theme.green500,
  },
  number: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Pretendard-Medium",
    color: "white",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 385,
    alignItems: "center",
    overflow: "hidden", // 자식 뷰가 부모 뷰를 넘어가지 않도록 설정
  },
  phone: {
    marginTop: 29,
    width: 194,
    height: 410,
    backgroundColor: "#BABABA",
  },
  shadowGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // 뷰의 아래쪽에 위치
    height: 10, // 그림자 높이
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Pretendard-Bold",
    color: theme.grey800,
  },
  boldText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    color: theme.grey800,
  },
  subTitle: {
    marginBottom: 4,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  subText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
    color: theme.grey800,
  },
  input: {
    justifyContent: "center",
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.grey100,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey900,
    borderWidth: 1,
    borderColor: "white",
  },
  inputText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 320,
    height: 56,
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    color: "white",
  },
  modal: {
    width: "100%",
    height: 442,
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
