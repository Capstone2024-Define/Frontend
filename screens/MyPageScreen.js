import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import SwitchToggle from "react-native-switch-toggle";
import AlarmModal from "../component/AlarmModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DaysModal from "../component/DaysModal";
import { useFocusEffect } from "@react-navigation/native";

export default function MyPageScreen({ navigation, route }) {
  // 알림 관련 시간 초기 설정(아싱크스토리지 저장 내용이 없을 때)
  const now = new Date();
  let currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const ampmValue = currentHour >= 12 ? "pm" : "am";

  if (currentHour > 12) {
    currentHour = currentHour - 12;
  } else if (currentHour === 0) {
    currentHour = 12;
  }
  const { ipnumber, user_code } = route.params;
  const [nickName, setNickName] = useState("");
  const [reminderToggle, setReminderToggle] = useState(false);
  const [weeklyToggle, setWeeklyToggle] = useState(false);
  const [alarmModalVisible, setAlarmModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedAmPm, setSelectedAmPm] = useState(ampmValue);
  const [selectedHour, setSelectedHour] = useState(currentHour.toString());
  const [selectedMinute, setSelectedMinute] = useState(
    currentMinute.toString().padStart(2, "0")
  );
  const [buttonPosition, setButtonPosition] = useState({ top: 0 }); // 알림 버튼 위치
  const buttonRef = useRef(null); // 버튼 참조
  const [consecutiveDay, setConsecutiveDay] = useState(0); // 연속 일자

  // 알림 모달 열기
  const openAlarmModal = () => {
    // 버튼 위치 가져오기
    buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setButtonPosition({ top: pageY + height });
    });
    setAlarmModalVisible(true);
  };

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          // 연속 날짜 로드
          const response_consecutiveDays = await axios.get(
            `http://${ipnumber}:8080/daily/consecutive/${user_code}`
          );
          setConsecutiveDay(response_consecutiveDays.data);
        } catch (error) {
          console.log("연속 날짜 로드 에러: ", error);
        }
      }
      load();
    }, [])
  );

  useEffect(() => {
    // 유저 이름 가져오기
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
    // 토글 상태 가져오기
    const loadToggle = async () => {
      try {
        const savedToggle = await AsyncStorage.getItem("toggleState");
        if (savedToggle !== null) {
          setReminderToggle(JSON.parse(savedToggle));
        }
        console.log("토글 상태: ", savedToggle);
      } catch (error) {
        console.error("토글 상태 로드 에러:", error);
      }
    };
    load();
    loadToggle();
    loadTime();
  }, []);

  useEffect(() => {
    if (reminderToggle) {
      loadTime();
    }
  }, [alarmModalVisible]);

  useEffect(() => {
    // 토글 상태 저장
    const saveToggle = async () => {
      try {
        await AsyncStorage.setItem(
          "toggleState",
          JSON.stringify(reminderToggle)
        );
        console.log("토글 상태 저장 완료");
      } catch (error) {
        console.log("토글 저장 에러: ", error);
      }
    };
    saveToggle();
  }, [reminderToggle]);

  // 알림 시간 로드
  const loadTime = async () => {
    try {
      const rawAlarm = await AsyncStorage.getItem("alarm");
      if (rawAlarm && rawAlarm !== "{}") {
        const alarm = JSON.parse(rawAlarm);
        setSelectedAmPm(alarm.ampm);
        setSelectedHour(alarm.hour);
        setSelectedMinute(alarm.minute);
      }
      console.log("마이페이지 아싱크스토리지 알람: ", rawAlarm);
    } catch (e) {
      console.log("알람 기록 로드 에러");
    }
  };

  // 카카오 로그아웃
  const logoutUser = async () => {
    try {
      const response = await axios.post(
        `http://${ipnumber}:8080/Logout`,
        null,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("로그아웃 성공");
        navigation.replace("KakaoLogin", { ipnumber: ipnumber });
      } else {
        console.log("로그아웃 실패", response.data);
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ paddingTop: 18, backgroundColor: "#FFFFFF" }}>
        <Text style={styles.greeting}>{"안녕하세요,"}</Text>
        <View style={styles.nickNameContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              navigation.push("ProfileModify", {
                user_code: user_code,
                ipnumber: ipnumber,
              })
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={styles.nickName}>{nickName}님</Text>
            <Image
              source={require("../assets/right_arrow.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={openModal}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["#79BA7E", "#AFCA85"]}
              style={styles.streakBox}
            >
              <Text style={styles.streakText}>{`${consecutiveDay}일`}</Text>
              <Text style={styles.streakSubText}>{"연속기록 중!"}</Text>
              <Image
                source={require("../assets/my_rabbit.png")}
                resizeMode={"contain"}
                style={styles.rabbitImage}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            height: 8,
            backgroundColor: "#F8F8F8",
            borderTopWidth: 1,
            borderTopColor: "#ECECEC",
          }}
        />

        {/* 기록하기 리마인드 알림 */}
        <View style={[styles.notificationContainer, { paddingTop: 20 }]}>
          <Image
            source={require("../assets/my_notifications.png")}
            resizeMode={"contain"}
            style={styles.notificationIcon}
          />
          <Text style={styles.notificationText}>
            {"기록하기 리마인드 알림"}
          </Text>
          <View style={{ flex: 1, alignSelf: "stretch" }} />
          <SwitchToggle
            switchOn={reminderToggle}
            onPress={() => setReminderToggle(!reminderToggle)}
            circleColorOff="#fff"
            circleColorOn="#fff"
            backgroundColorOn={theme.green500}
            backgroundColorOff={theme.grey300}
            containerStyle={{
              width: 47,
              borderRadius: 46,
              padding: 2,
            }}
            circleStyle={{
              width: 25,
              height: 25,
              borderRadius: 20,
            }}
          />
        </View>
        <View style={styles.notificationDescriptionContainer}>
          <Text style={styles.notificationDescription}>
            {"매일 잊지 않게 푸시알림을 보내드려요"}
          </Text>
          {reminderToggle && (
            <TouchableOpacity
              ref={buttonRef}
              activeOpacity={0.5}
              onPress={openAlarmModal}
              style={styles.timeButton}
            >
              <Text style={styles.timeButtonText}>
                {selectedHour}:{selectedMinute} {selectedAmPm}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 주간분석결과 알림 */}
        <View style={styles.notificationContainer}>
          <Image
            source={require("../assets/my_chart.png")}
            resizeMode={"center"}
            style={{ width: 24, height: 18, marginRight: 12 }}
          />
          <Text style={styles.notificationText}>{"주간분석결과 알림"}</Text>
          <View style={{ flex: 1, alignSelf: "stretch" }} />
          <SwitchToggle
            switchOn={weeklyToggle}
            onPress={() => setWeeklyToggle(!weeklyToggle)}
            circleColorOff="#fff"
            circleColorOn="#fff"
            backgroundColorOn={theme.green500}
            backgroundColorOff={theme.grey300}
            containerStyle={{
              width: 47,
              borderRadius: 46,
              padding: 2,
            }}
            circleStyle={{
              width: 25,
              height: 25,
              borderRadius: 20,
            }}
          />
        </View>
        <Text style={[styles.notificationDescription, { marginLeft: 56 }]}>
          {"매주 일요일 오후 9시 주간분석결과 알림을 보내드려요"}
        </Text>

        {/* 주간 분석 결과 밑에 구분선 추가 */}
        <View style={styles.divider} />

        {/* 메뉴 항목 */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Bookmark")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/my_bookmark.png")}
              style={styles.menuIcon}
            />
            <Text style={styles.notificationText}>북마크한 정보</Text>
          </View>
          <Image
            source={require("../assets/right_arrow.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("PreparingGuide")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/my_guide.png")}
              style={styles.menuIcon}
            />
            <Text style={styles.notificationText}>이용가이드</Text>
          </View>
          <Image
            source={require("../assets/right_arrow.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, { marginBottom: 0 }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../assets/my_info.png")}
              style={styles.menuIcon}
            />
            <Text style={styles.notificationText}>앱 정보</Text>
          </View>
          <Image
            source={require("../assets/right_arrow.png")}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 로그아웃 */}
        <TouchableOpacity
          onPress={() => logoutUser()}
          style={styles.logoutItem}
        >
          <Image
            source={require("../assets/my_logout.png")}
            style={styles.menuIcon}
          />
          <Text style={[styles.notificationText, { color: theme.grey400 }]}>
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
          style={styles.logoutItem}
        >
          <Text style={[styles.notificationText, { color: theme.grey400 }]}>
            테스트 페이지
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <DaysModal
        ipnumber={ipnumber}
        user_code={user_code}
        visible={visible}
        closeModal={closeModal}
        consecutiveDay={consecutiveDay}
      />
      <AlarmModal
        visible={alarmModalVisible}
        onClose={() => setAlarmModalVisible(false)}
        onToggle={reminderToggle}
        buttonPosition={buttonPosition}
      />
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
    lineHeight: 24,
    fontFamily: "Pretendard-Regular",
    marginBottom: 4,
    marginLeft: 20,
  },
  nickNameContainer: {
    marginBottom: 20,
    marginHorizontal: 20,
  },
  nickName: {
    color: "#333333",
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Pretendard-Bold",
    marginRight: 4,
  },
  streakBox: {
    height: 94,
    borderRadius: 8,
    paddingBottom: 31,
    paddingHorizontal: 16,
    paddingTop: 12,
    overflow: "hidden",
  },
  streakText: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Pretendard-Bold",
  },
  streakSubText: {
    color: "#F2F8F2",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
  },
  rabbitImage: {
    position: "absolute",
    top: 5,
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
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
  },
  notificationDescriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    marginHorizontal: 20,
    paddingLeft: 36,
  },
  notificationDescription: {
    color: "#6F6F6F",
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
  },
  timeButton: {
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 11,
  },
  timeButtonText: {
    color: "#79BA7E",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginBottom: 20,
    marginHorizontal: 20,
  },
  logoutText: {
    color: "#8B8B8B",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
});
