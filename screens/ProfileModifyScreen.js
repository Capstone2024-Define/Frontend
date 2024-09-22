import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  TextInput,
} from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Edit from "../assets/edit_gray.svg";
import { useEffect, useLayoutEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileModifyScreen({ navigation }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // 키보드 활성화 감지
  const [nickName, setNickName] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [valid, setValid] = useState(true); // 날짜 유효성 검사

  // 특정 TextInput에 입력중인지 판단하는 변수
  const [nickNameFocus, setNickNameFocus] = useState(false);
  const [nickNameKeyboard, setNickNameKeyboard] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);
  const [nameKeyboard, setNameKeyboard] = useState(false);
  const [birthFocus, setBirthFocus] = useState(false);
  const [birthKeyboard, setBirthKeyboard] = useState(false);

  // 잘되나 test, 나중에 DB에 넣을거
  useEffect(() => {
    console.log("닉네임: ", nickName);
    console.log("이름: ", name);
    console.log("생일: ", birth);
    console.log("성별: ", gender);
  }, [nickName, name, birth, gender]);

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
    if (!isKeyboardVisible && nickNameFocus) {
      setNickNameKeyboard(false);
    } else if (isKeyboardVisible && nickNameFocus) {
      setNickNameKeyboard(true);
    }

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
    <SafeAreaView style={styles.container}>
      <Header
        left="leftArrow"
        title="프로필 수정"
        onLeftPress={() => {
          navigation.pop();
        }}
      />

      {isKeyboardVisible && birthFocus ? null : (
        <>
          <View style={{ ...styles.subContainer, paddingTop: 20 }}>
            <Text style={styles.title}>내 정보</Text>
            <Text style={styles.subTitle}>닉네임</Text>
            <View
              style={[
                styles.input,
                nickName.length > 0 &&
                  nickNameKeyboard &&
                  isKeyboardVisible && {
                    backgroundColor: theme.green50,
                  },
                nickName.length > 0 &&
                  !nickNameKeyboard && {
                    backgroundColor: theme.green50,
                    borderColor: theme.green500,
                  },
                nickName.length > 10 && {
                  backgroundColor: theme.grey100,
                  borderColor: theme.red,
                },
                ,
              ]}
            >
              <TextInput
                style={styles.inputText}
                onChangeText={setNickName}
                returnKeyType="done"
                value={nickName}
                onFocus={() => {
                  setNickNameFocus(true);
                  setNickNameKeyboard(true);
                }}
                onBlur={() => {
                  setNickNameFocus(false);
                  setNickNameKeyboard(false);
                }}
              />
              <WithLocalSvg asset={Edit} />
            </View>
            {nickName.length > 10 && (
              <Text style={styles.warn}>10자 이내로만 설정할 수 있어요!</Text>
            )}
          </View>
          <View style={styles.line} />
        </>
      )}
      <View
        style={{
          ...styles.subContainer,
          flex: 1,
          paddingBottom: 20,
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={styles.title}>아이 정보</Text>
          <Text style={styles.subTitle}>이름</Text>
          <View
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
          >
            <TextInput
              style={styles.inputText}
              onChangeText={setName}
              returnKeyType="done"
              value={name}
              onFocus={() => {
                setNameFocus(true);
                setNameKeyboard(true);
              }}
              onBlur={() => {
                setNameFocus(false);
                setNameKeyboard(false);
              }}
            />
            <WithLocalSvg asset={Edit} />
          </View>
          {name.length > 10 && (
            <Text style={styles.warn}>10자 이내로만 설정할 수 있어요!</Text>
          )}
          <View style={{ marginBottom: 12 }}></View>
          <Text style={styles.subTitle}>생년월일</Text>
          <View
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
          >
            <TextInput
              style={styles.inputText}
              onChangeText={handleBirthChange}
              returnKeyType="done"
              keyboardType="number-pad"
              value={birth}
              maxLength={14} // YYYY / MM / DD 의 최대 길이
              onFocus={() => {
                setBirthFocus(true);
                setBirthKeyboard(true);
              }}
              onBlur={() => {
                setBirthFocus(false);
                setBirthKeyboard(false);
              }}
            />
            <WithLocalSvg asset={Edit} />
          </View>
          {!valid && birth.length >= 1 && !birthKeyboard && (
            <Text style={styles.warn}>유효한 날짜를 입력해주세요!</Text>
          )}
          {valid &&
            birth.length >= 1 &&
            birth.length < 14 &&
            !birthKeyboard && (
              <Text style={styles.warn}>날짜를 형식에 맞게 입력해주세요!</Text>
            )}
          <View style={{ marginBottom: 12 }} />
          <Text style={styles.subTitle}>성별</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              style={[
                styles.gender,
                { marginRight: 6 },
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
                  styles.genderText,
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
                  styles.genderText,
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
              disabled={
                !(
                  nickName.length >= 1 &&
                  nickName.length <= 10 &&
                  name.length >= 1 &&
                  name.length <= 10 &&
                  birth.length == 14 &&
                  gender
                )
              }
              onPress={() => {
                console.log("확인");
              }}
            >
              <LinearGradient
                colors={["#79BA7E", "#AFCA85"]}
                style={styles.button}
              >
                <View
                  style={[
                    styles.button,
                    nickName.length >= 1 &&
                      nickName.length <= 10 &&
                      name.length >= 1 &&
                      name.length <= 10 &&
                      birth.length == 14 &&
                      gender && { backgroundColor: "transparent" },
                  ]}
                >
                  <Text
                    style={[styles.title, { marginBottom: 0, color: "white" }]}
                  >
                    확인
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
    backgroundColor: "white",
  },
  subContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    color: theme.grey800,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
    marginBottom: 4,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.grey100,
    borderWidth: 1,
    borderColor: "white",
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  line: {
    width: "100%",
    height: 8,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
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
  genderText: {
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
    backgroundColor: theme.grey250,
  },
  warn: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.red,
  },
});
