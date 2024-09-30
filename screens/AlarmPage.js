import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { WithLocalSvg } from "react-native-svg/css";
import Back from "../assets/arrow_back_ios.svg";
import Delete from "../assets/delete.svg";
import Check from "../assets/check_white.svg";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../colors/color";

// Expo Notifications 임포트 한 것
import * as Notifications from "expo-notifications";

export default function AlarmPage({ navigation }) {
  const [alarms, setAlarms] = useState([]);
  const [state, setState] = useState(false); // true -> 삭제 모드
  const [selectedAlarms, setSelectedAlarms] = useState([]); // 삭제 선택된 알람
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  // 알림 권한 요청 및 알림 핸들러 설정
  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("알림 권한이 거부되었습니다!");
      }
    };

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    requestNotificationPermissions();
  }, []);

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

  // 삭제모드 시 뒤로가기 커스텀(기본 모드로 변경되게)
  useEffect(() => {
    const onBackPress = () => {
      if (state) {
        setState(false);
        setSelectedAlarms([]);
        return true; // 뒤로가기 버튼 기본 동작 막기
      }
      return false; // 뒤로가기 버튼 기본 동작 허용
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [state]);

  // alarms 상태가 변경될 때마다 콘솔에 출력
  useEffect(() => {
    console.log("알람 데이터:", alarms);
  }, [alarms]);

  const handleAddAlarm = () => {
    // 'AlarmSettingsPage'로 이동
    navigation.navigate("AlarmSettingsPage");
  };

  // 삭제 알람 선택
  const handlePress = (index) => {
    if (state) {
      setSelectedAlarms((prevSelected) => {
        if (prevSelected.includes(index)) {
          // 이미 선택된 경우 제거
          return prevSelected.filter((i) => i !== index);
        } else {
          // 선택되지 않은 경우 추가
          return [...prevSelected, index];
        }
      });
    }
  };

  // 전체선택
  const handleSelectAll = () => {
    if (state) {
      setSelectedAlarms(alarms.map((_, index) => index));
    }
  };

  const handleDelete = async () => {
    if (state) {
      const newAlarms = alarms.filter(
        (_, index) => !selectedAlarms.includes(index)
      );

      try {
        await AsyncStorage.setItem("alarm", JSON.stringify(newAlarms));
        setAlarms(newAlarms);
        setSelectedAlarms([]);
        setState(false);
      } catch (e) {
        console.log("삭제 실패:", e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {!state ? (
            <WithLocalSvg asset={Back} width={27} />
          ) : (
            <TouchableOpacity activeOpacity={0.5} onPress={handleSelectAll}>
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
            onPress={() => {
              setState(!state);
              setSelectedAlarms([]);
            }}
          >
            <Text style={styles.delText}>{"      "}취소</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          width: "100%",
          height: 1,
          backgroundColor: "#EBEBEB",
          marginBottom: 23,
        }}
      />
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
                onPress={() => handlePress(index)}
                style={{
                  ...styles.circle,
                  backgroundColor: !state
                    ? "white"
                    : selectedAlarms.includes(index)
                    ? theme.red
                    : theme.grey150,
                }}
              >
                {selectedAlarms.includes(index) && (
                  <WithLocalSvg asset={Check} />
                )}
              </TouchableOpacity>
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
            onPress={handleDelete}
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
    //marginBottom: 23,
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
    alignItems: "center",
    justifyContent: "center",
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
