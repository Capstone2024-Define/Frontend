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
} from "react-native";
import { useEffect, useState } from "react";
import Header from "../component/Header";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../colors/color";
import Feather from "@expo/vector-icons/Feather";
import { WithLocalSvg } from "react-native-svg/css";
import Calendar from "../assets/calender.svg";
import { useLayoutEffect } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ExportRecordScreen({ navigation }) {
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

    console.log("Page: ", page);

    return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 제거
  }, [page]);

  useEffect(() => {
    console.log("시작 날짜: ", startDate);
    console.log("종료 날짜: ", endDate);
  }, [startDate, endDate]);

  // 이메일 유효성 체크
  useEffect(() => {
    setIsValidEmail(validateEmail(email));
    console.log("이메일: ", email);
  }, [email]);

  // 이메일 유효성 체크
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
          <View style={{ flexDirection: "row", marginVertical: 20 }}>
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
          <Text style={{ ...styles.subText, marginBottom: 20 }}>
            {page == 1
              ? "불러올 기록의 범위를 선택해주세요"
              : "기록을 내보낼 곳을 입력해주세요"}
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
                  {startDate ? startDate : "2024 / 07 / 27"}
                </Text>
                <TouchableOpacity activeOpacity={0.5}>
                  <WithLocalSvg asset={Calendar} />
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
                  {endDate ? endDate : "2024 / 07 / 27"}
                </Text>
                <TouchableOpacity activeOpacity={0.5}>
                  <WithLocalSvg asset={Calendar} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.subTitle}>이메일</Text>
              <TextInput
                placeholder="example@naver.com"
                style={[
                  styles.input,
                  email.length > 0 &&
                    isValidEmail && { backgroundColor: theme.green50 },
                  email.length > 0 &&
                    isValidEmail &&
                    !isKeyboardVisible && { borderColor: theme.green500 },
                  email.length > 0 &&
                    !isValidEmail &&
                    !isKeyboardVisible && { borderColor: theme.red },
                ]}
                placeholderTextColor={theme.grey400}
                onChangeText={setEmail}
                returnKeyType="done"
                value={email}
                keyboardType="email-address"
              />
            </View>
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
            메일로 기록을 보내드렸어요!
          </Text>
          <Text style={{ ...styles.subText, color: theme.grey600 }}>
            메일함을 확인해주세요
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
        {!isKeyboardVisible && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              page == 0
                ? setPage(1)
                : page == 1
                ? setPage(2)
                : page == 2
                ? setPage(3)
                : navigation.pop();
            }}
            disabled={page == 2 && !isValidEmail ? true : false}
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
});
