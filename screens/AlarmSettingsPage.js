import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Picker 사용
import { LinearGradient } from "expo-linear-gradient"; // 그라디언트 라이브러리

export default function AlarmSettingsPage({ navigation }) {
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedAmPm, setSelectedAmPm] = useState("am");
  const [selectedDays, setSelectedDays] = useState([false, false, false, false, false, false, false]); // 요일 상태

  const toggleDaySelection = (index) => {
    const updatedDays = [...selectedDays];
    updatedDays[index] = !updatedDays[index];
    setSelectedDays(updatedDays);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/backIcon.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>알림설정</Text>
        <Image
          source={require("../assets/trashIcon.png")}
          style={styles.icon}
        />
      </View>

      <Text style={styles.alarmTitle}>알림 설정</Text>
      <Text style={styles.alarmDescription}>
        푸시 알림을 받을 시각과 요일을 설정해주세요.
      </Text>

      {/* 시계 */}
      <View style={styles.timePickerContainer}>
        <View style={styles.timePickerMainRow}>
          {/* Picker 수정된 부분 */}
          <Picker
            selectedValue={selectedHour}
            onValueChange={(itemValue) => setSelectedHour(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
            ))}
          </Picker>
          <Text style={styles.colonText}>:</Text>
          <Picker
            selectedValue={selectedMinute}
            onValueChange={(itemValue) => setSelectedMinute(itemValue)}
            style={styles.picker}
          >
            
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={`${i}`} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedAmPm}
            onValueChange={(itemValue) => setSelectedAmPm(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="am" value="am" />
            <Picker.Item label="pm" value="pm" />
          </Picker>
        </View>
      </View>

      {/* 요일 반복 설정 */}
      <Text style={styles.repeatLabel}>요일반복</Text>
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
                selectedDays[index] ? styles.enabledText : styles.disabledText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 확인 버튼 */}
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#79BA7E", "#AFCA85"]}
        style={styles.confirmButton}
      >
        <TouchableOpacity onPress={() => { /* 알림 설정 로직 추가 */ }}>
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 30,
    paddingBottom: 68,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 24,
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
  },
  alarmTitle: {
    color: "#242424",
    fontSize: 18,
    marginBottom: 9,
    marginLeft: 25,
  },
  alarmDescription: {
    color: "#555555",
    fontSize: 14,
    marginBottom: 22,
    marginLeft: 25,
  },
  timePickerContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 27,
    marginBottom: 31,
  },
  timePickerMainRow: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor:"#FBFBFB",
    paddingTop: 14,
    paddingBottom: 4,
    marginBottom: 4,
  },
  picker: {
    width: 58,
  },
  colonText: {
    color: "#242424",
    fontSize: 22,
    marginTop: 4,
    marginRight: 44,
  },
  repeatLabel: {
    color: "#242424",
    fontSize: 16,
    marginBottom: 16,
    marginLeft: 25,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginHorizontal: 23,
  },
  dayCircle: {
    width: 37,
    alignItems: "center",
    borderRadius: 46,
    paddingVertical: 11,
  },
  enabledDay: {
    backgroundColor: "#78BA7D",
  },
  disabledDay: {
    backgroundColor: "#EFEFEF",
  },
  dayText: {
    fontSize: 16,
  },
  enabledText: {
    color: "#FFFFFF",
  },
  disabledText: {
    color: "#8B8B8B",
  },
  confirmButton: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 21,
    marginHorizontal: 24,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
