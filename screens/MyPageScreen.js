import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export default function MyPageScreen({ navigation, route }) {
  const { ipnumber, user_code } = route.params;
  const [nickName, setNickName] = useState("");
  const [reminderToggle, setReminderToggle] = useState(true);
  const [weeklyToggle, setWeeklyToggle] = useState(false);

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
      <ScrollView style={{ backgroundColor: "#FFFFFF", paddingTop: 7 }}>
        <Text style={styles.greeting}>{"안녕하세요,"}</Text>
        <View style={styles.nickNameContainer}>
          <Text style={styles.nickName}>{nickName}님</Text>
          <View>
            <LinearGradient
              start={{ x: 0, y: -0 }}
              end={{ x: 1, y: 1 }}
              colors={["#79BA7E", "#AFCA85"]}
              style={styles.streakBox}
            >
              <Text style={styles.streakText}>{"7일"}</Text>
              <Text style={styles.streakSubText}>{"연속기록 중!"}</Text>
              <Image
                source={require("../assets/my_rabbit.png")}
                resizeMode={"stretch"}
                style={styles.rabbitImage}
              />
            </LinearGradient>
          </View>
        </View>

        {/* 기록하기 리마인드 알림 */}
        <View style={styles.notificationContainer}>
          <Image
            source={require("../assets/my_notifications.png")}
            resizeMode={"stretch"}
            style={styles.notificationIcon}
          />
          <Text style={styles.notificationText}>{"기록하기 리마인드 알림"}</Text>
          <View style={{ flex: 1, alignSelf: "stretch" }} />
          <Switch
            value={reminderToggle}
            onValueChange={(value) => setReminderToggle(value)}
            trackColor={{ false: "#A5A5A5", true: "#78BA7D" }}
            thumbColor={"#FFFFFF"}
          />
        </View>
        <View style={styles.notificationDescriptionContainer}>
          <Text style={styles.notificationDescription}>
            {"매일 잊지 않게 푸시알림을 보내드려요"}
          </Text>
          <View style={styles.timeButton}>
            <Text style={styles.timeButtonText}>{"시간연결"}</Text>
          </View>
        </View>

        {/* 주간분석결과 알림 */}
        <View style={styles.notificationContainer}>
          <Image
            source={require("../assets/my_chart.png")}
            resizeMode={"stretch"}
            style={styles.notificationIcon}
          />
          <Text style={styles.notificationText}>{"주간분석결과 알림"}</Text>
          <View style={{ flex: 1, alignSelf: "stretch" }} />
          <Switch
            value={weeklyToggle}
            onValueChange={(value) => setWeeklyToggle(value)}
            trackColor={{ false: "#A5A5A5", true: "#78BA7D" }}
            thumbColor={"#FFFFFF"}
          />
        </View>
        <Text style={styles.notificationDescription}>
          {"매주 일요일 주간분석결과 알림을 보내드려요"}
        </Text>

        {/* 주간 분석 결과 밑에 구분선 추가 */}
        <View style={styles.divider} />

        {/* 메뉴 항목 */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Bookmark")} // Bookmark 화면으로 이동
        >
          <Image
            source={require("../assets/my_bookmark.png")}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>북마크한 정보</Text>
          <Image
            source={require("../assets/right_arrow.png")} // 오른쪽 화살표 아이콘 추가
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image
            source={require("../assets/my_guide.png")}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>이용가이드</Text>
          <Image
            source={require("../assets/right_arrow.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image
            source={require("../assets/my_info.png")}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>앱 정보</Text>
          <Image
            source={require("../assets/right_arrow.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        {/* 앱 정보 밑에 구분선 추가 */}
        <View style={styles.divider} />

        {/* 로그아웃 */}
        <TouchableOpacity style={styles.logoutItem}>
          <Image
            source={require("../assets/my_logout.png")}
            style={styles.menuIcon}
          />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  greeting: {
    color: "#6F6F6F",
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 21,
  },
  nickNameContainer: {
    marginBottom: 24,
    marginHorizontal: 20,
  },
  nickName: {
    color: "#333333",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 1,
  },
  streakBox: {
    borderRadius: 8,
    paddingTop: 18,
    paddingBottom: 31,
    paddingHorizontal: 16,
  },
  streakText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 9,
  },
  streakSubText: {
    color: "#F2F8F2",
    fontSize: 16,
    fontWeight: "bold",
  },
  rabbitImage: {
    position: "absolute",
    top: -5,
    right: 31,
    width: 67,
    height: 105,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginHorizontal: 20,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  notificationText: {
    color: "#555555",
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationDescriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  notificationDescription: {
    color: "#6F6F6F",
    fontSize: 12,
    marginLeft: 56,
  },
  timeButton: {
    width: 90,
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    paddingVertical: 14,
  },
  timeButtonText: {
    color: "#78BA7D",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginVertical: 19,
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 20,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  menuText: {
    color: "#555555",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  arrowIcon: {
    width: 24,
    height: 24,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 44,
    marginHorizontal: 20,
  },
  logoutText: {
    color: "#8B8B8B",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
});
