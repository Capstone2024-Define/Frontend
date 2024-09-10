import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // 그라데이션 라이브러리

export default function AlarmPage({ navigation }) {
  const [alarms, setAlarms] = useState([]);

  const handleAddAlarm = () => {
    // 'AlarmSettingsPage'로 이동
    navigation.navigate("AlarmSettingsPage");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/backIcon.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text style={styles.title}>알림설정</Text>
        <Image
          source={require("../assets/trashIcon.png")}
          style={{ width: 24, height: 24 }}
        />
      </View>

      {/* 설명 텍스트 부분 */}
      <View style={styles.body}>
        <Text style={styles.infoText}>
          잊지 않고 기록할 수 있도록 {"\n"} 예약한 요일 및 시간에 푸시 알림을 보내드려요
        </Text>
      </View>

      {/* 추가하기 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleAddAlarm}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#79BA7E", "#AFCA85"]}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>추가하기</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    marginBottom: 23,
  },
  title: {
    color: "#242424",
    fontSize: 16,
  },
  body: {
    flex: 1, // 내용이 버튼 위로 스크롤되도록 설정
    paddingHorizontal: 24,
  },
  infoText: {
    textAlign: "left",
    lineHeight: 20,
    color: "#555555",
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  addButton: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 21,
    width: "100%",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
