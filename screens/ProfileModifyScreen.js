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
  const [isBirthFocused, setBirthFocused] = useState(false); // 생년월일 입력 감지
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // 키보드 활성화 감지
  const [nickName, setNickName] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [valid, setValid] = useState(true); // 날짜 유효성 검사

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

      {isKeyboardVisible && isBirthFocused ? null : (
        <>
          <View style={{ ...styles.subContainer, paddingTop: 20 }}>
            <Text style={styles.title}>내 정보</Text>
            <Text style={styles.subTitle}>닉네임</Text>
            <View
              style={[
                styles.input,
                nickName.length > 10 && { borderColor: theme.red },
              ]}
            >
              <TextInput
                style={styles.inputText}
                onChangeText={setNickName}
                returnKeyType="done"
                value={nickName}
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
              name.length > 10 && { borderColor: theme.red },
            ]}
          >
            <TextInput
              style={styles.inputText}
              onChangeText={setName}
              returnKeyType="done"
              value={name}
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
              !valid && birth.length >= 1 && { borderColor: theme.red },
              valid &&
                birth.length >= 1 &&
                birth.length < 14 && { borderColor: theme.red },
            ]}
          >
            <TextInput
              style={styles.inputText}
              onFocus={() => setBirthFocused(true)} // 생년월일 입력 필드 포커스
              onBlur={() => setBirthFocused(false)} // 포커스 해제 시
              onChangeText={handleBirthChange}
              returnKeyType="done"
              keyboardType="number-pad"
              value={birth}
              maxLength={14} // YYYY / MM / DD 의 최대 길이
            />
            <WithLocalSvg asset={Edit} />
          </View>
          {!valid && birth.length >= 1 && (
            <Text style={styles.warn}>유효한 날짜를 입력해주세요!</Text>
          )}
          {valid && birth.length >= 1 && birth.length < 14 && (
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
                gender === "M" && { backgroundColor: theme.green500 },
              ]}
              onPress={() => {
                setGender("M");
              }}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "M"
                    ? { color: "white" }
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
                gender === "F" && { backgroundColor: theme.green500 },
              ]}
              onPress={() => {
                setGender("F");
              }}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "F"
                    ? { color: "white" }
                    : { color: theme.grey600 },
                ]}
              >
                여자아이
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: theme.green50,
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
    width: 153,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
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
    width: 312,
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
