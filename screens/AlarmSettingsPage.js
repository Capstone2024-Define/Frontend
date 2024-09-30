import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { WithLocalSvg } from "react-native-svg/css";
import Back from "../assets/arrow_back_ios.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { theme } from "../colors/color";
import * as Notifications from "expo-notifications";

export default function AlarmSettingsPage({ navigation }) {
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const minutes = Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, "0"));
  const ampm = ["am", "pm"];

  const now = new Date();
  let currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const ampmValue = currentHour >= 12 ? "pm" : "am";

  if (currentHour > 12) {
    currentHour = currentHour - 12;
  } else if (currentHour === 0) {
    currentHour = 12;
  }

  const [selectedHour, setSelectedHour] = useState(currentHour.toString());
  const [selectedMinute, setSelectedMinute] = useState(
    currentMinute.toString().padStart(2, "0")
  );
  const [selectedAmPm, setSelectedAmPm] = useState(ampmValue);
  const [selectedDays, setSelectedDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [isEverydayChecked, setIsEverydayChecked] = useState(false);

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

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }, []);

  const toggleDaySelection = (index) => {
    const updatedDays = [...selectedDays];
    updatedDays[index] = !updatedDays[index];
    setSelectedDays(updatedDays);
  };

  const toggleEverydayCheckbox = () => {
    const newCheckedState = !isEverydayChecked;
    setIsEverydayChecked(newCheckedState);
    setSelectedDays(
      newCheckedState
        ? [true, true, true, true, true, true, true]
        : [false, false, false, false, false, false, false]
    );
  };

  const save = async (toSave) => {
    try {
      const rawAlarmList = await AsyncStorage.getItem("alarm");
      let alarmList = [];
      if (rawAlarmList) {
        try {
          alarmList = JSON.parse(rawAlarmList);
        } catch (parseError) {
          console.error("JSON 파싱 에러:", parseError);
        }
      }
      alarmList.push(toSave);
      await AsyncStorage.setItem("alarm", JSON.stringify(alarmList));
    } catch (error) {
      console.error("기록 저장 에러:", error);
    }
  };

  const scheduleAlarm = async (hour, minute, ampm, selectedDays) => {
    const now = new Date();
    const currentDay = now.getDay();

    selectedDays.forEach((isSelected, index) => {
      if (isSelected) {
        const alarmDay = (index + 7 - currentDay) % 7;
        const triggerTime = new Date(now);

        triggerTime.setDate(now.getDate() + alarmDay);
        triggerTime.setHours(
          ampm === "pm" ? parseInt(hour) + 12 : parseInt(hour)
        );
        triggerTime.setMinutes(parseInt(minute));
        triggerTime.setSeconds(0);

        Notifications.scheduleNotificationAsync({
          content: {
            title: "Clobit",
            body: "설정된 시간입니다!",
          },
          trigger: {
            date: triggerTime,
            repeats: false,
            repeats: true, // 반복 설정
            weekday: (index + 1) % 7,
          },
        });
      }
    });
  };

  const handleComplete = async () => {
    if (selectedDays.every((day) => !day)) {
      return; // 요일이 하나도 선택되지 않은 경우, 확인 버튼 클릭을 방지
    }
    const newAlarm = {
      hour: selectedHour,
      minute: selectedMinute,
      ampm: selectedAmPm,
      days: selectedDays,
    };
    console.log("새로운 알람", newAlarm);

    // 알림 스케줄링
    await scheduleAlarm(
      selectedHour,
      selectedMinute,
      selectedAmPm,
      selectedDays
    );

    await save(newAlarm);
    navigation.pop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <WithLocalSvg asset={Back} width={27} />
        </TouchableOpacity>
        <Text style={styles.title}>알림설정</Text>
        <View style={{ width: 25 }} />
      </View>
      <View
        style={{
          width: "100%",
          height: 1,
          marginBottom: 20,
          backgroundColor: "#EBEBEB",
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.alarmTitle}>알림 설정</Text>
        <Text style={styles.alarmDescription}>
          푸시 알림을 받을 시각과 요일을 설정해주세요.
        </Text>

        {/* 시계 */}
        <View style={styles.timePickerContainer}>
          <View style={styles.pickerActiveView} />
          <View style={styles.timePickerMainRow}>
            <ScrollPicker
              dataSource={hours}
              selectedIndex={hours.indexOf(selectedHour)}
              wrapperHeight={144}
              wrapperBackground={"transparent"}
              itemHeight={33}
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
                paddingHorizontal: 25,
              }}
            >
              :
            </Text>
            <ScrollPicker
              dataSource={minutes}
              selectedIndex={minutes.indexOf(selectedMinute)}
              wrapperHeight={144}
              wrapperBackground={"transparent"}
              itemHeight={33}
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
              wrapperHeight={144}
              wrapperBackground={"transparent"}
              itemHeight={33}
              highlightBorderWidth={0}
              activeItemTextStyle={{
                ...styles.pickerActiveText,
                marginLeft: 10,
              }}
              itemTextStyle={{ ...styles.pickerDefaultText, marginLeft: 10 }}
              onValueChange={(data) => {
                setSelectedAmPm(data);
              }}
            />
          </View>
        </View>

        {/* 요일 반복 설정 */}
        <Text style={styles.repeatLabel}>요일반복</Text>

        {/* 체크박스와 "매일" 텍스트 */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              isEverydayChecked && styles.checkedCheckbox,
            ]}
            onPress={toggleEverydayCheckbox}
          >
            {isEverydayChecked && (
              <Image
                source={require("../assets/checkBox.png")}
                style={styles.checkImage}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.dailyText}>매일</Text>
        </View>

        {/* 요일 선택 */}
        <View style={styles.daysContainer}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCircle,
                selectedDays[index] ? styles.enabledDay : styles.disabledDay,
              ]}
              onPress={() => toggleDaySelection(index)}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDays[index]
                    ? styles.enabledText
                    : styles.disabledText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* 확인 버튼 */}
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={handleComplete}
        disabled={selectedDays.every((day) => !day)} // 요일이 선택되지 않으면 버튼 비활성화
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={["#79BA7E", "#AFCA85"]}
          style={[
            styles.confirmButton,
            selectedDays.every((day) => !day) && { opacity: 0.5 },
          ]}
        >
          <Text style={styles.confirmButtonText}>확인</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 24,
    //marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    color: "#242424",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    fontFamily: "Pretendard-Medium",
  },
  alarmTitle: {
    color: "#242424",
    fontSize: 18,
    marginBottom: 4,
    marginLeft: 25,
    fontFamily: "Pretendard-Medium",
  },
  alarmDescription: {
    color: "#555555",
    fontSize: 14,
    marginBottom: 19,
    marginLeft: 25,
    fontFamily: "Pretendard-Regular",
  },
  timePickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 180,
    paddingVertical: 20,
    marginBottom: 26,
    backgroundColor: theme.grey50,
  },
  timePickerMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 60,
  },
  pickerActiveView: {
    position: "absolute",
    width: "100%",
    height: 44,
    backgroundColor: theme.green100,
  },
  colonText: {
    color: "#242424",
    fontSize: 22,
    marginTop: 95,
  },
  repeatLabel: {
    color: "#242424",
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 25,
    fontFamily: "Pretendard-Medium",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
    marginBottom: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    backgroundColor: "#EFEFEF",
    borderRadius: 4,
    marginRight: 9,
    justifyContent: "center", // 세로 중앙 정렬
    alignItems: "center", // 가로 중앙 정렬
  },
  checkedCheckbox: {
    backgroundColor: "#79BA7E",
  },
  checkImage: {
    width: 12,
    height: 8,
  },
  dailyText: {
    fontSize: 14,
    color: "#242424",
    fontFamily: "Pretendard-Regular",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginHorizontal: 25,
  },
  dayCircle: {
    width: 37,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 46,
    borderWidth: 1,
    borderColor: "white",
  },
  enabledDay: {
    backgroundColor: theme.green50,
    borderColor: theme.green500,
  },
  disabledDay: {
    backgroundColor: "#EFEFEF",
    borderColor: "#EFEFEF",
  },
  dayText: {
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
  },
  enabledText: {
    color: theme.green500,
  },
  disabledText: {
    color: theme.grey400,
  },
  confirmButton: {
    height: 56,
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Pretendard-Bold",
  },
  pickerActiveText: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "Pretendard-Bold",
    color: theme.grey800,
  },
  pickerDefaultText: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
    color: theme.grey400,
  },
});
