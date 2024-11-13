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
}) {
  const [consecutiveDay, setConsecutiveDay] = useState(0);
  const [registeredData, setRegisteredData] = useState([
    true,
    false,
    true,
    false,
    true,
    true,
    false,
  ]); // 예시 데이터

  const slideAnim = useState(new Animated.Value(350))[0]; // 애니메이션 초기값

  useEffect(() => {
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
  });

  // 모달이 열릴 때 애니메이션 실행
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

  // 팝업 내용 컴포넌트
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
                  ? require("../assets/my_modal_circle_green.png") // 있으면
                  : require("../assets/my_modal_circle.png") // 없으면
              }
              resizeMode={"stretch"}
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
