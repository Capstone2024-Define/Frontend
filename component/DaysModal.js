import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DaysModal({
  ipnumber,
  user_code,
  visible,
  closeModal,
  consecutiveDay,
}) {
  // const [consecutiveDay, setConsecutiveDay] = useState(0);
  const [registeredData, setRegisteredData] = useState(
    new Array(7).fill(false)
  );

  const slideAnim = useState(new Animated.Value(350))[0];

  // useEffect(() => {
  //   async function load() {
  //     try {
  //       // 연속 날짜 로드
  //       const response_consecutiveDays = await axios.get(
  //         `http://${ipnumber}:8080/daily/consecutive/${user_code}`
  //       );
  //       setConsecutiveDay(response_consecutiveDays.data);
  //     } catch (error) {
  //       console.log("연속 날짜 로드 에러: ", error);
  //     }
  //   }
  //   load();
  // }, []);

  // 애니메이션
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 350,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      fetchWeeklyData();
    }
  }, [visible]);

  const fetchWeeklyData = async () => {
    const today = new Date();
    const currentDay = today.getDay();

    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    // 요부분 자정쯤엔 UTC 시간으로 동작하길래 수정했어요
    const start = sunday.toLocaleDateString("sv-SE");
    const end = saturday.toLocaleDateString("sv-SE");

    try {
      const response = await axios.get(
        `${ipnumber}:8080/daily/period/${user_code}/${start}/${end}`
      );

      const newRegisteredData = new Array(7).fill(false);
      response.data.forEach((record) => {
        const recordDate = new Date(record.date).getDay();
        newRegisteredData[recordDate] = true;
      });

      setRegisteredData(newRegisteredData);
    } catch (error) {
      console.log("Failed to fetch weekly data: ", error);
    }
  };

  const PopupContent = ({ registeredData, onRequestClose }) => (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onRequestClose}
        style={{ marginBottom: 22 }}
      >
        <Image
          source={require("../assets/inarow_close.png")}
          resizeMode={"contain"}
          style={{
            width: 13,
            height: 13,
            marginLeft: 5,
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginTop: 5,
        }}
      >
        <View style={{}}>
          <Text
            style={{
              color: "#fff",
              fontSize: 36,
              fontFamily: "Pretendard-Bold",
              lineHeight: 44,
              marginTop: 2,
            }}
          >
            {`${consecutiveDay}일`}
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontFamily: "Pretendard-Bold",
              marginVertical: 8,
              lineHeight: 28,
            }}
          >
            {"연속 기록중!"}
          </Text>
          <Text
            style={{
              color: theme.green100,
              fontSize: 16,
              fontFamily: "Pretendard-Medium",
              marginBottom: 20,
              marginRight: 23,
              lineHeight: 24,
            }}
          >
            {"매일 기록하시는 모습이 \n정말 멋져요!"}
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              lineHeight: 24,
              fontFamily: "Pretendard-Bold",
            }}
          >
            {"이번주 연속기록"}
          </Text>
        </View>
        <Image
          source={require("../assets/my_rabbit.png")}
          resizeMode={"contain"}
          style={{ height: 236, width: 154 }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 70,
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
          padding: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 5,
            marginBottom: 4,
            paddingHorizontal: 15,
          }}
        >
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <Text
              key={index}
              style={{
                color: registeredData[index] ? "#78BA7D" : "#8B8B8B",
                fontSize: 14,
                fontFamily: "Pretendard-Bold",
                lineHeight: 20,
              }}
            >
              {day}
            </Text>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 11.5,
          }}
        >
          {registeredData.map((isRegistered, index) => (
            <Image
              key={index}
              source={
                isRegistered
                  ? require("../assets/my_modal_circle_green.png")
                  : require("../assets/my_modal_circle.png")
              }
              resizeMode={"contain"}
              style={{ width: 20, height: 20 }}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <Modal transparent={true} visible={visible} onRequestClose={closeModal}>
      <Pressable style={styles.modalOverlay} onPress={closeModal}>
        <Animated.View style={[{ transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={["#79BA7E", "#AFCA85"]}
            style={styles.popupContainer}
          >
            <PopupContent
              registeredData={registeredData}
              onRequestClose={closeModal}
            />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "transparent",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
});
