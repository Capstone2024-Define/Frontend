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

export default function StartInfoScreen({ navigation }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false); // 키보드 활성화 감지
  const [page, setPage] = useState(1);
  const [nickName, setNickName] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");

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
          {/* page별로 다른 내용 보여줌 */}
          {page == 1 ? (
            <>
              <View style={{ marginTop: 25, marginBottom: 20 }}>
                <Text style={styles.hi}>안녕하세요!</Text>
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
                    nickName.length > 10 && { borderColor: theme.red },
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
              <View style={{ marginTop: 25, marginBottom: 17 }}>
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
                    name.length > 10 && { borderColor: theme.red },
                  ]}
                  placeholderTextColor={theme.grey400}
                  onChangeText={setName}
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
                  style={styles.input}
                  placeholderTextColor={theme.grey400}
                  onChangeText={handleBirthChange}
                  returnKeyType="done"
                  keyboardType="number-pad"
                  value={birth}
                  maxLength={14} // YYYY / MM / DD 의 최대 길이: 14자
                />
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
                        styles.subText,
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
                        styles.subText,
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
            </>
          )}
        </View>

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
                <View
                  style={[
                    styles.button,
                    nickName.length >= 1 &&
                      nickName.length <= 10 && {
                        backgroundColor: theme.green500,
                      },
                  ]}
                >
                  <Text style={[styles.title, { color: "white" }]}>다음</Text>
                </View>
              </TouchableOpacity>
            )
          : !isKeyboardVisible && (
              <TouchableOpacity
                activeOpacity={0.5}
                disabled={
                  !(name.length >= 1 && name.length <= 10 && birth && gender)
                }
                onPress={() => {}}
              >
                <View
                  style={[
                    styles.button,
                    name.length >= 1 &&
                      name.length <= 10 &&
                      birth &&
                      gender && { backgroundColor: theme.green500 },
                  ]}
                >
                  <Text style={[styles.title, { color: "white" }]}>
                    시작하기
                  </Text>
                </View>
              </TouchableOpacity>
            )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingTop: 32,
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
  hi: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Regular",
    color: theme.grey900,
  },
  title: {
    marginVertical: 4,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    color: theme.grey900,
  },
  describe: {
    fontSize: 12,
    lineHeight: 20,
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
    backgroundColor: theme.green50,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey900,
    borderWidth: 1,
    borderColor: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 312,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.grey250,
  },
  subText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey400,
  },
  gender: {
    width: 153,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: theme.grey150,
  },
});
