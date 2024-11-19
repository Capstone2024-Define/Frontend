import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { theme } from "../colors/color";
import * as Notifications from "expo-notifications";
import { bottomBtn } from "../component/BottomButton";

export default function AlarmModal({
  visible,
  onClose,
  onToggle,
  buttonPosition = { top: 317 },
}) {
  const now = new Date();
  let currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const ampmValue = currentHour >= 12 ? "pm" : "am";

  if (currentHour > 12) {
    currentHour -= 12;
  } else if (currentHour === 0) {
    currentHour = 12;
  }

  const [selectedAmPm, setSelectedAmPm] = useState(ampmValue);
  const [selectedHour, setSelectedHour] = useState(currentHour.toString());
  const [selectedMinute, setSelectedMinute] = useState(
    currentMinute.toString().padStart(2, "0")
  );

  const hours = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const minutes = Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, "0"));
  const ampm = ["am", "pm"];

  useEffect(() => {
    const getPermissions = async () => {
      const settings = await Notifications.getPermissionsAsync();
      if (!settings.granted && !settings.canAskAgain) {
        alert("알림 권한이 필요합니다.");
      } else if (!settings.granted) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("알림 권한을 부여해주세요.");
        }
      }
    };
    getPermissions();

    printScheduledAlarms();

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }, []);

  useEffect(() => {
    console.log("알림 활성화: ", onToggle);

    const toggleAlarm = async () => {
      if (onToggle) {
        await loadTime();
      } else {
        await cancelAlarm();
      }
    };

    toggleAlarm();
  }, [onToggle]);

  // 알림 확인용
  const printScheduledAlarms = async () => {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log("스케줄된 알림:", scheduledNotifications);
    } catch (error) {
      console.error("스케줄된 알림 가져오기 에러:", error);
    }
  };

  // 알림 시간 로드
  const loadTime = async () => {
    try {
      const rawAlarm = await AsyncStorage.getItem("alarm");
      if (rawAlarm && rawAlarm !== "{}") {
        const alarm = JSON.parse(rawAlarm);

        setSelectedAmPm(alarm.ampm);
        setSelectedHour(alarm.hour);
        setSelectedMinute(alarm.minute);

        const alarmExist =
          await Notifications.getAllScheduledNotificationsAsync();
        if (alarmExist.length <= 0) {
          await scheduleAlarm(alarm.hour, alarm.minute, alarm.ampm);
        }
      } else {
        console.log("아싱크스토리지 결과 없음");
        save();
        await scheduleAlarm(
          currentHour.toString(),
          currentMinute.toString().padStart(2, "0"),
          ampmValue
        );
      }
      console.log("아싱크스토리지 알람: ", rawAlarm);
    } catch (e) {
      console.log("알람 기록 로드 에러 ", e);
    }
  };

  const cancelAlarm = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("알림 삭제 성공");
    } catch (error) {
      console.error("알림 삭제 실패:", error);
    }
  };

  const save = async () => {
    try {
      const alarm = {
        ampm: selectedAmPm,
        hour: selectedHour,
        minute: selectedMinute,
      };
      await AsyncStorage.setItem("alarm", JSON.stringify(alarm));
      console.log("알림 저장 완료");
    } catch (error) {
      console.error("기록 저장 에러:", error);
    }
  };

  const scheduleAlarm = async (hour, minute, ampm) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync(); // 기존 알림 삭제

      console.log("ampm: ",ampm, "hour: ",hour, "minute: ",minute)
      const triggerHour =
        ampm === "pm" && parseInt(hour) !== 12
          ? parseInt(hour) + 12
          : ampm === "am" && parseInt(hour) === 12
          ? 0
          : parseInt(hour);
      const triggerMinute = parseInt(minute);

      // NaN 체크
      if (isNaN(triggerHour) || isNaN(triggerMinute)) {
        
        console.error("알림 설정 오류: 유효하지 않은 시간 값입니다.");
        return;
      }

      console.log("알림 설정 시간:", triggerHour, "시", triggerMinute, "분");

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Clobit",
          body: "클로빗과 함께 기록하실 시간이에요! 오늘도 고생 많으셨어요🍀",
        },
        trigger: {
          hour: triggerHour,
          minute: triggerMinute,
          repeats: true,
        },
      });
    } catch (error) {
      console.error("알림 스케줄 오류:", error);
    }

    printScheduledAlarms(); // 알림 확인용
  };

  // 완료
  const handleComplete = async () => {
    await save();
    await scheduleAlarm(selectedHour, selectedMinute, selectedAmPm);
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[styles.container, { top: buttonPosition.top + 8, right: 20 }]}
        >
          {/* 시계 */}
          <View style={styles.timePickerContainer}>
            <View style={styles.pickerActiveView} />
            <View style={styles.timePickerMainRow}>
              <ScrollPicker
                dataSource={hours}
                selectedIndex={hours.indexOf(selectedHour)}
                wrapperHeight={140}
                wrapperBackground={"transparent"}
                itemHeight={34}
                highlightBorderWidth={0}
                activeItemTextStyle={styles.pickerActiveText}
                itemTextStyle={styles.pickerDefaultText}
                onValueChange={(data) => {
                  setSelectedHour(data);
                }}
              />
              <Text
                style={{
                  ...styles.pickerActiveText,
                  paddingHorizontal: 8,
                }}
              >
                :
              </Text>
              <ScrollPicker
                dataSource={minutes}
                selectedIndex={minutes.indexOf(selectedMinute)}
                wrapperHeight={140}
                wrapperBackground={"transparent"}
                itemHeight={34}
                highlightBorderWidth={0}
                activeItemTextStyle={styles.pickerActiveText}
                itemTextStyle={styles.pickerDefaultText}
                onValueChange={(data) => {
                  setSelectedMinute(data);
                }}
              />
              <ScrollPicker
                dataSource={ampm}
                selectedIndex={ampm.indexOf(selectedAmPm)}
                wrapperHeight={140}
                wrapperBackground={"transparent"}
                itemHeight={34}
                highlightBorderWidth={0}
                activeItemTextStyle={{
                  ...styles.pickerActiveText,
                  paddingLeft: 2,
                }}
                itemTextStyle={{
                  ...styles.pickerDefaultText,
                  marginLeft: 2,
                }}
                onValueChange={(data) => {
                  setSelectedAmPm(data);
                }}
              />
            </View>
          </View>
          {/* 확인 버튼 */}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={handleComplete}
            style={{
              width: "100%",
              alignItems: "center",
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["#79BA7E", "#AFCA85"]}
              style={styles.button}
            >
              <Text style={bottomBtn.buttonText}>확인</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 227,
    backgroundColor: theme.grey100,
    borderRadius: 8,
    paddingVertical: 12,
    position: "absolute",
    zIndex: 10,
  },
  timePickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 140,
    backgroundColor: theme.grey100,
    marginBottom: 12,
  },
  timePickerMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30,
  },
  pickerActiveView: {
    position: "absolute",
    width: 203,
    height: 44,
    backgroundColor: theme.grey100,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.green200,
  },
  pickerActiveText: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "Pretendard-Bold",
    color: theme.green500,
  },
  pickerDefaultText: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
    color: theme.grey400,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Pretendard-Bold",
  },
  button: {
    width: 196,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
