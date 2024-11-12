import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Switch,
  Modal,
  ImageBackground,
  Pressable, 
} from "react-native";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import SwitchToggle from "react-native-switch-toggle";
import AlarmModal from "../component/AlarmModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyPageScreen({ navigation, route }) {
  const { ipnumber, user_code } = route.params;
  const [nickName, setNickName] = useState("");
  const [reminderToggle, setReminderToggle] = useState(false);
  const [weeklyToggle, setWeeklyToggle] = useState(false);
  const [visible, setVisible] = useState(false); // 알림 모달
  const [registeredData, setRegisteredData] = useState([true, false, true, false, true, true, false]); // 예시 데이터

  const openModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  useEffect(() => {
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
    load();
  }, []);

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
              <Text style={styles.streakText}>{"7일"}</Text>
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
        <Text style={[styles.notificationDescription, { marginLeft: 56 }]}>
          {"매주 일요일 주간분석결과 알림을 보내드려요"}
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
        <TouchableOpacity style={styles.logoutItem}>
          <Image
            source={require("../assets/my_logout.png")}
            style={styles.menuIcon}
          />
          <Text style={[styles.notificationText, { color: theme.grey400 }]}>
            로그아웃
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
  transparent={true}
  visible={visible}  
  onRequestClose={closeModal}
  animationType="slide"
>
  <Pressable style={styles.modalOverlay} onPress={closeModal}>
    <View style={styles.popupContainer}>
      <PopupContent registeredData={registeredData} />
    </View>
  </Pressable>
</Modal>
    </SafeAreaView>
  );
}

// 팝업 내용 컴포넌트
const PopupContent = ({ registeredData }) => (
  <View
    style={{
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 24,
      paddingBottom: 48,
      paddingHorizontal: 20,
    }}
  >
    <Image
   source={require("../assets/inarow_close.png")}
      resizeMode={"stretch"}
      style={{
        width: 24,
        height: 24,
        marginBottom: 22,
      }}
    />
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <View style={{ flex: 1, marginTop: 8, marginRight: 4 }}>
        <Text
          style={{
            color: "#78BA7D",
            fontSize: 36,
           fontFamily:"Pretendard-Bold",
            marginBottom: 14,
            marginLeft: 1,
          }}
        >
          {"7일"}
        </Text>
        <Text
          style={{
            color: "#555555",
            fontSize: 22,
          fontFamily:"Pretendard-Bold",
            marginBottom: 15,
          }}
        >
          {"연속 기록중!"}
        </Text>
        <Text
          style={{
            color: "#8B8B8B",
            fontSize: 16,
    fontFamily:"Pretendard-Medium",
            marginBottom: 36,
            width: 168,
          }}
        >
          {"매일 기록하시는 모습이 \n정말 멋져요!"}
        </Text>
        <Text style={{ color: "#555555", fontSize: 16, fontFamily:"Pretendard-Bold" }}>
          {"이번주 연속기록"}
        </Text>
      </View>
      <View style={{ width: 148 }}>
        <Image
      source={require("../assets/my_rabbit.png")}
          resizeMode={"stretch"}
          style={{ height: 230,
            width:120
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -30,
            right: 1,
            width: 320,
            height: 70,
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            paddingHorizontal: 19,
            shadowColor: "#0000001A",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              marginBottom: 6,
            }}
          >
            {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
              <Text
                key={index}
                style={{
                  color: registeredData[index] ? "#78BA7D" : "#8B8B8B",
                  fontSize: 14,
                  fontWeight: "bold",
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
    </View>
  </View>
);

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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 48,
    paddingHorizontal: 20,
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
