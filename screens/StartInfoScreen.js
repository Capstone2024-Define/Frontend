import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { useEffect, useLayoutEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { WithLocalSvg } from "react-native-svg/css";
import Calendar from "../assets/calender.svg";
import { LinearGradient } from "expo-linear-gradient";

export default function StartInfoScreen({ navigation }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // 키보드 활성화 감지
  const [page, setPage] = useState(1);
  const [nickName, setNickName] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [valid, setValid] = useState(true); // 날짜 유효성 검사

  // 특정 TextInput에 입력중인지 판단하는 변수
  const [nameFocus, setNameFocus] = useState(true);
  const [nameKeyboard, setNameKeyboard] = useState(false);
  const [birthFocus, setBirthFocus] = useState(false);
  const [birthKeyboard, setBirthKeyboard] = useState(false);

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

  // 각 TextInput 키보드 감지
  useEffect(() => {
    if (!isKeyboardVisible && nameFocus) {
      setNameKeyboard(false);
    } else if (isKeyboardVisible && nameFocus) {
      setNameKeyboard(true);
    }

    if (!isKeyboardVisible && birthFocus) {
      setBirthKeyboard(false);
    } else if (isKeyboardVisible && birthFocus) {
      setBirthKeyboard(true);
    }
  }, [isKeyboardVisible]);

  // 잘되나 test
  useEffect(() => {
    console.log("닉네임: ", nickName);
    console.log("이름: ", name);
    console.log("생일: ", birth);
    console.log("성별: ", gender);
  }, [nickName, name, birth, gender]);

  // 생년월일 입력
  const handleBirthChange = (text) => {
    let formatBirth = text;

    if (formatBirth.length == 4) {
      formatBirth = formatBirth + " / ";
    } else if (formatBirth.length >= 5 && formatBirth.length <= 6) {
      formatBirth = formatBirth.slice(0, 4);
    } else if (formatBirth.length == 9) {
      formatBirth = formatBirth + " / ";
    } else if (formatBirth.length >= 10 && formatBirth.length <= 11) {
      formatBirth = formatBirth.slice(0, 9);
    }
    setBirth(formatBirth);

    // 생년월일 유효성 검사
    const isValidDate = validateDate(formatBirth);
    if (isValidDate) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  // 유효한 날짜인지 확인하는 함수
  const validateDate = (birth) => {
    const [year, month, day] = birth
      .split(" / ")
      .map((num) => parseInt(num, 10));

    // 입력된 값이 숫자가 아닌 경우 유효하지 않음
    if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

    // 1. 월이 1~12 범위에 있는지 확인
    if (month < 1 || month > 12) return false;

    // 2. 해당 월의 마지막 날짜 구하기
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > lastDayOfMonth) return false;

    // 3. 현재 날짜 이전인지 확인
    const enteredDate = new Date(year, month - 1, day); // 월은 0부터 시작하므로 -1
    const currentDate = new Date();

    if (enteredDate >= currentDate) return false; // 현재 또는 미래 날짜는 유효하지 않음

    // 4. 연, 월, 일이 유효한지 최종 확인
    const isValid =
      enteredDate.getFullYear() === year &&
      enteredDate.getMonth() === month - 1 && // 월은 다시 -1 확인
      enteredDate.getDate() === day;

    return isValid;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        left="leftArrow"
        title="정보입력"
        onLeftPress={() => {
          page == 1 ? navigation.pop() : setPage(1);
        }}
      />
      <View style={styles.container}>
        <View>
          {!birthKeyboard ? (
            <View style={{ flexDirection: "row" }}>
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
          ) : (
            <></>
          )}
          {/* page별로 다른 내용 보여줌 */}
          {page == 1 ? (
            <>
              <View
                style={{
                  marginTop: 24,
                  marginBottom: 20,
                }}
              >
                <Text style={styles.title}>
                  사용하실 닉네임을{"\n"}입력해주세요!
                </Text>
                <Text style={styles.describe}>
                  닉네임은 나중에 수정할 수 있어요
                </Text>
              </View>
              <View>
                <Text style={styles.subTitle}>닉네임</Text>
                <TextInput
                  placeholder="닉네임을 입력해주세요 (최대 10자)"
                  style={[
                    styles.input,
                    nickName.length > 0 && {
                      backgroundColor: theme.green50,
                    },
                    nickName.length > 0 &&
                      !isKeyboardVisible && {
                        backgroundColor: theme.green50,
                        borderColor: theme.green500,
                      },
                    nickName.length > 10 && {
                      backgroundColor: theme.grey100,
                      borderColor: theme.red,
                    },
                  ]}
                  placeholderTextColor={theme.grey400}
                  onChangeText={setNickName}
                  returnKeyType="done"
                  value={nickName}
                />
                {nickName.length > 10 && (
                  <Text style={styles.warn}>
                    10자 이내로만 설정할 수 있어요!
                  </Text>
                )}
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  marginTop: !birthKeyboard ? 24 : 10,
                  marginBottom: 17,
                }}
              >
                <Text style={styles.title}>
                  디파인님의 아이에 대해서{"\n"}알려주세요!
                </Text>
              </View>
              <View>
                <Text style={styles.subTitle}>이름</Text>
                <TextInput
                  placeholder="아이의 이름을 입력해주세요 (최대 10자)"
                  style={[
                    styles.input,
                    name.length > 0 &&
                      nameKeyboard &&
                      isKeyboardVisible && {
                        backgroundColor: theme.green50,
                      },
                    name.length > 0 &&
                      !nameKeyboard && {
                        backgroundColor: theme.green50,
                        borderColor: theme.green500,
                      },
                    name.length > 10 && {
                      backgroundColor: theme.grey100,
                      borderColor: theme.red,
                    },
                  ]}
                  placeholderTextColor={theme.grey400}
                  value={name}
                  onChangeText={setName}
                  onFocus={() => {
                    setNameFocus(true);
                    setNameKeyboard(true);
                  }}
                  onBlur={() => {
                    setNameFocus(false);
                    setNameKeyboard(false);
                  }}
                  returnKeyType="done"
                />
                {name.length > 10 && (
                  <Text style={styles.warn}>
                    10자 이내로만 설정할 수 있어요!
                  </Text>
                )}
                <Text style={[styles.subTitle, { marginTop: 24 }]}>
                  생년월일
                </Text>
                <TextInput
                  placeholder="2024 / 07 / 27"
                  style={[
                    styles.input,
                    !valid &&
                      birth.length >= 1 &&
                      !birthKeyboard && {
                        backgroundColor: theme.grey100,
                        borderColor: theme.red,
                      },
                    valid &&
                      birth.length >= 1 &&
                      birth.length < 14 &&
                      !birthKeyboard && {
                        backgroundColor: theme.grey100,
                        borderColor: theme.red,
                      },
                    valid &&
                      birth.length == 14 &&
                      !birthKeyboard && {
                        backgroundColor: theme.green50,
                        borderColor: theme.green500,
                      },
                    valid &&
                      birth.length == 14 &&
                      birthKeyboard && {
                        backgroundColor: theme.green50,
                      },
                  ]}
                  placeholderTextColor={theme.grey400}
                  onChangeText={handleBirthChange}
                  keyboardType="number-pad"
                  value={birth}
                  maxLength={14} // YYYY / MM / DD 의 최대 길이: 14자
                  onFocus={() => {
                    setBirthFocus(true);
                    setBirthKeyboard(true);
                  }}
                  onBlur={() => {
                    setBirthFocus(false);
                    setBirthKeyboard(false);
                  }}
                  returnKeyType="done"
                />
                {!valid && birth.length >= 1 && !birthKeyboard && (
                  <Text style={styles.warn}>유효한 날짜를 입력해주세요!</Text>
                )}
                {valid &&
                  birth.length >= 1 &&
                  birth.length < 14 &&
                  !birthKeyboard && (
                    <Text style={styles.warn}>
                      날짜를 형식에 맞게 입력해주세요!
                    </Text>
                  )}
                {/* <View style={styles.input}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.subText}>2024 / 07 / 27</Text>
                    <TouchableOpacity activeOpacity={0.5}>
                      <WithLocalSvg width={24} height={24} asset={Calendar} />
                    </TouchableOpacity>
                  </View>
                </View> */}
                <Text style={[styles.subTitle, { marginTop: 24 }]}>성별</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[
                      styles.gender,
                      gender === "M" && {
                        backgroundColor: theme.green50,
                        borderColor: theme.green500,
                      },
                    ]}
                    onPress={() => {
                      setGender("M");
                    }}
                  >
                    <Text
                      style={[
                        styles.subText,
                        gender === "M"
                          ? {
                              color: theme.green500,
                              fontFamily: "Pretendard-Bold",
                            }
                          : { color: theme.grey600 },
                      ]}
                    >
                      남자아이
                    </Text>
                  </TouchableOpacity>
                  <View style={{ width: 12 }} />
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[
                      styles.gender,
                      gender === "F" && {
                        backgroundColor: theme.green50,
                        borderColor: theme.green500,
                      },
                    ]}
                    onPress={() => {
                      setGender("F");
                    }}
                  >
                    <Text
                      style={[
                        styles.subText,
                        gender === "F"
                          ? {
                              color: theme.green500,
                              fontFamily: "Pretendard-Bold",
                            }
                          : { color: theme.grey600 },
                      ]}
                    >
                      여자아이
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {page == 1
            ? !isKeyboardVisible && (
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={!(nickName.length >= 1 && nickName.length <= 10)}
                  onPress={() => {
                    if (page == 1) setPage(2);
                    else if (page == 2) setPage(1);
                  }}
                >
                  <LinearGradient
                    colors={["#79BA7E", "#AFCA85"]}
                    style={styles.gradientButton}
                  >
                    <View
                      style={[
                        styles.button,
                        nickName.length >= 1 &&
                          nickName.length <= 10 && {
                            backgroundColor: "transparent",
                          },
                      ]}
                    >
                      <Text style={[styles.buttonText, { color: "white" }]}>
                        다음
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )
            : !isKeyboardVisible && (
                <TouchableOpacity
                  activeOpacity={0.5}
                  disabled={
                    !(
                      name.length >= 1 &&
                      name.length <= 10 &&
                      birth.length == 14 &&
                      gender
                    )
                  }
                  onPress={() => {
                    console.log("시작하기");
                  }}
                >
                  <LinearGradient
                    colors={["#79BA7E", "#AFCA85"]}
                    style={styles.gradientButton}
                  >
                    <View
                      style={[
                        styles.button,
                        name.length >= 1 &&
                          name.length <= 10 &&
                          birth.length == 14 &&
                          gender && { backgroundColor: "transparent" },
                      ]}
                    >
                      <Text style={[styles.buttonText, { color: "white" }]}>
                        시작하기
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
  title: {
    marginBottom: 4,
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Pretendard-Bold",
    color: theme.grey900,
  },
  describe: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Regular",
    color: theme.grey600,
  },
  subTitle: {
    marginBottom: 4,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
    color: theme.grey600,
  },
  warn: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.red,
  },
  input: {
    justifyContent: "center",
    height: 50,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.grey100,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey900,
    borderWidth: 1,
    borderColor: "white",
  },
  gradientButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 312,
    height: 56,
    borderRadius: 16,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 312,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.grey250,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
  },
  subText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey400,
  },
  gender: {
    flex: 1,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: theme.grey150,
  },
});
