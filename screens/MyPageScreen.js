import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Notice from "../assets/notice_white.svg";
import Export from "../assets/export_white.svg";
import Bookmark from "../assets/bookmark_white.svg";
import Edit from "../assets/edit_green.svg";
import Guide from "../assets/guide_green.svg";
import Info from "../assets/appInfo_green.svg";
import Logout from "../assets/logout_green.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function MyPageScreen({ navigation, route }) {
  const { ipnumber, user_code } = route.params;
  const [nickName, setNickName] = useState("");

  // 상태바 변경(안드로이드)
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "android") {
        StatusBar.setBarStyle("light-content");
        StatusBar.setBackgroundColor("#79BA7E");
      }

      // Android에서 다른 화면으로 나갈 때 상태바 기본값으로 복구
      return () => {
        if (Platform.OS === "android") {
          StatusBar.setBarStyle("dark-content");
          StatusBar.setBackgroundColor("#FFFFFF"); // Android 기본 배경색
        }
      };
    }, [])
  );

  // 닉네임(유저 이름) 가져오기
  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(
          `http://${ipnumber}:8080/userinfo/get/${user_code}`
        );
        setNickName(response.data.user_name);
      } catch (error) {
        console.log("유저 GET 에러: ", error);
      }
    }
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#79BA7E", "#AFCA85"]}
        locations={[0.3, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.subContainer}>
          <Text style={{ ...styles.m_text, color: "white" }}>안녕하세요!</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 33,
            }}
          >
            <Text style={{ ...styles.L_text, marginTop: 4 }}>{nickName}님</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                navigation.push("ProfileModify", {
                  user_code: user_code,
                  ipnumber: ipnumber,
                })
              }
              style={styles.button}
            >
              <Text style={{ ...styles.ss_text, marginRight: 2 }}>
                프로필수정
              </Text>
              <WithLocalSvg asset={Edit} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.push("Bookmark")} // Navigate to Bookmark screen
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <WithLocalSvg asset={Bookmark} />
              <Text style={styles.s_text}>북마크한 정보</Text>
            </TouchableOpacity>
            <View
              style={{
                width: 2,
                height: 34,
                borderRadius: 40,
                backgroundColor: "#ABD2A6",
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                navigation.push("ExportRecord", {
                  user_code: user_code,
                  ipnumber: ipnumber,
                })
              }
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <WithLocalSvg asset={Export} />
              <Text style={styles.s_text}>기록 내보내기</Text>
            </TouchableOpacity>
            <View
              style={{
                width: 2,
                height: 34,
                borderRadius: 40,
                backgroundColor: "#ABD2A6",
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => navigation.push("AlarmPage")} // 알림 설정 페이지로 이동
            >
              <WithLocalSvg asset={Notice} />
              <Text style={styles.s_text}>알림 설정하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {/* <View style={styles.line}/> */}
      <View style={{ ...styles.subContainer, paddingTop: 40 }}>
        <LinearGradient
          colors={["#00000020", "#00000000", "transparent"]}
          style={styles.shadowGradient}
        />
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <WithLocalSvg asset={Guide} />
          <Text
            style={{
              ...styles.m_text,
              color: theme.grey600,
              marginLeft: 8,
            }}
          >
            이용가이드
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <WithLocalSvg asset={Info} />
          <Text
            style={{
              ...styles.m_text,
              color: theme.grey600,
              marginLeft: 8,
            }}
          >
            앱 정보
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <WithLocalSvg asset={Logout} />
          <Text
            style={{
              ...styles.m_text,
              color: theme.grey600,
              marginLeft: 8,
            }}
          >
            로그아웃
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            console.log("test");
            navigation.push("Test", {
              ipnumber: ipnumber,
              user_code: user_code,
            });
          }}
        >
          <Text
            style={{ ...styles.m_text, color: theme.grey250, marginBottom: 11 }}
          >
            TEST 페이지
          </Text>
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
  subContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  L_text: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Pretendard-Bold",
    color: "white",
  },
  m_text: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Regular",
  },
  s_text: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: "white",
  },
  ss_text: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.green500,
  },
  button: {
    flexDirection: "row",
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 50,
    backgroundColor: theme.green100,
  },
  line: {
    width: "100%",
    height: 8,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },
  shadowGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 30, // 그림자 높이
  },
});
