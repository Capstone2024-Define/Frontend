import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { WithLocalSvg } from "react-native-svg/css";
import Check from "../assets/start_check.svg";
import SwitchToggle from "react-native-switch-toggle";
import AlarmModal from "../component/AlarmModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StartInfoScreen3({ navigation, route }) {
  const { ipnumber, user_code } = route.params;
  const [reminderToggle, setReminderToggle] = useState(false);
  const [weeklyToggle, setWeeklyToggle] = useState(false);
  const [visible, setVisible] = useState(false); // 알림 모달

  // 모달 위치를 위한 버튼 위치
  const [buttonPosition, setButtonPosition] = useState({ top: 0 }); // 알림 버튼 위치
  const buttonRef = useRef(null); // 버튼 참조

  const openModal = () => {
    // 버튼 위치 가져오기
    buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setButtonPosition({ top: pageY + height });
    });
    setVisible(true);
  };

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

  const [selectedAmPm, setSelectedAmPm] = useState(ampmValue);
  const [selectedHour, setSelectedHour] = useState(currentHour.toString());
  const [selectedMinute, setSelectedMinute] = useState(
    currentMinute.toString().padStart(2, "0")
  );

  useEffect(() => {
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
    loadToggle();
    loadTime();
  }, []);

  useEffect(() => {
    // 알림 시간 불러오기
    if (reminderToggle) {
      loadTime();
    }
  }, [visible]);

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

  const modalClose = () => {
    setVisible(false);
  };

  // 알림 시간 로드
  const loadTime = async () => {
    try {
      const rawAlarm = await AsyncStorage.getItem("alarm");
      if (rawAlarm) {
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

  const changeStateLogin = async () => {
    try {
      await AsyncStorage.setItem("state", "login");
    } catch (error) {
      console.log("state 변경 에러: ", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        left="leftArrow"
        title="정보입력"
        onLeftPress={() => {
          navigation.pop();
        }}
      />
      <View style={styles.container}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={[
                styles.circle,
                { backgroundColor: theme.green100 },
                { marginRight: 16 },
              ]}
            >
              <WithLocalSvg asset={Check} />
            </View>
            <View
              style={[
                styles.circle,
                { backgroundColor: theme.green100 },
                { marginRight: 16 },
              ]}
            >
              <WithLocalSvg asset={Check} />
            </View>
            <View style={[styles.circle, { marginRight: 16 }]}>
              <Text style={styles.number}>3</Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 24,
              marginBottom: 20,
            }}
          >
            <Text style={styles.title}>
              기록을 잊지 않게{"\n"}알림을 보내드릴게요
            </Text>
          </View>
          <View>
            {/* 기록하기 리마인드 알림 */}
            <View style={styles.notificationContainer}>
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
                {"매일 기록하기 알림을 보내드려요"}
              </Text>
              {reminderToggle && (
                <TouchableOpacity
                  ref={buttonRef}
                  activeOpacity={0.5}
                  onPress={openModal}
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
            <Text style={[styles.notificationDescription, { marginLeft: 36 }]}>
              {"매주 일요일 주간분석결과 알림을 보내드려요"}
            </Text>
          </View>
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
            onPress={async () => {
              await changeStateLogin();
              navigation.pop();
              navigation.replace("Main", {
                ipnumber: ipnumber,
                user_code: user_code,
                showTutorial: true,
              });
            }}
          >
            <LinearGradient
              colors={["#79BA7E", "#AFCA85"]}
              style={styles.button}
            >
              <View style={[styles.button, { backgroundColor: "transparent" }]}>
                <Text style={[styles.buttonText, { color: "white" }]}>
                  시작하기
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <AlarmModal
        visible={visible}
        onClose={modalClose}
        onToggle={reminderToggle}
        buttonPosition={buttonPosition}
      />
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
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
});
