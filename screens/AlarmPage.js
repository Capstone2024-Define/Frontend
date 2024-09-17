import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // 그라데이션 라이브러리
import { WithLocalSvg } from "react-native-svg/css";
import Back from "../assets/arrow_back_ios.svg";
import Delete from "../assets/delete.svg";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../colors/color";

export default function AlarmPage({ navigation }) {
  const [alarms, setAlarms] = useState([]);
  const [state, setState] = useState(false); // true -> 삭제 모드
  const [select, setSelect] = useState(false); // true -> 삭제 대상
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  // 알람 기록 로드
  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const rawAlarm = await AsyncStorage.getItem("alarm");
          if (rawAlarm) {
            const alarm = JSON.parse(rawAlarm);
            setAlarms(alarm);
          }
        } catch (e) {
          console.log("기록 없음 혹은 로드 에러");
        }
      }
      load();
    }, [])
  );

  // alarms 상태가 변경될 때마다 콘솔에 출력
  useEffect(() => {
    console.log("알람 데이터:", alarms);
  }, [alarms]);

  const handleAddAlarm = () => {
    // 'AlarmSettingsPage'로 이동
    navigation.navigate("AlarmSettingsPage");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Image
            source={require("../assets/backIcon.png")}
            style={{ width: 24, height: 24 }}
          /> */}
          {!state ? (
            <WithLocalSvg asset={Back} width={27} />
          ) : (
            <TouchableOpacity activeOpacity={0.5}>
              <Text style={styles.delText}>전체선택</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <Text style={styles.title}>알림설정</Text>
        {!state ? (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setState(!state)}
          >
            <WithLocalSvg asset={Delete} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setState(!state)}
          >
            <Text style={styles.delText}>{"      "}취소</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 설명 텍스트 부분 */}
      <View style={styles.body}>
        <Text style={styles.infoText}>
          잊지 않고 기록할 수 있도록 {"\n"}예약한 요일 및 시간에 푸시 알림을
          보내드려요
        </Text>
        <ScrollView style={{ marginTop: 19 }}>
          {alarms.map((alarm, index) => (
            <View key={index} style={styles.alarmContainer}>
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.time}>
                    {alarm.hour}:
                    {alarm.minute.length == 1
                      ? "0" + alarm.minute
                      : alarm.minute}
                  </Text>
                  <Text style={{ ...styles.time, marginLeft: 8 }}>
                    {alarm.ampm}
                  </Text>
                </View>
                <Text style={styles.infoText}>
                  {alarm.days
                    .map((day, index) => (day ? days[index] + ", " : ""))
                    .join("")
                    .slice(0, -2)}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setSelect(!select)}
                style={{
                  ...styles.circle,
                  backgroundColor: !state ? "white" : theme.grey150,
                }}
              ></TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 추가하기 버튼 */}
      <View style={styles.footer}>
        {!state ? (
          <TouchableOpacity activeOpacity={0.5} onPress={handleAddAlarm}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["#79BA7E", "#AFCA85"]}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>추가하기</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ ...styles.addButton, backgroundColor: theme.red }}
          >
            <Text style={styles.addButtonText}>삭제하기</Text>
          </TouchableOpacity>
        )}
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
    fontFamily: "Pretendard-Medium",
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
    fontFamily: "Pretendard-Regular",
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
    height: 56,
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    width: "100%",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Pretendard-Bold",
  },
  alarmContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 76,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.grey200,
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  time: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  circle: {
    width: 25,
    height: 25,
    borderRadius: 20,
  },
  delText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    color: theme.green500,
  },
});
