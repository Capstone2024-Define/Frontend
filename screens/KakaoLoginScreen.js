import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState } from "react";
import { theme } from "../colors/color";
import { FontAwesome } from "@expo/vector-icons";
import { WithLocalSvg } from "react-native-svg/css";
import Kakao from "../assets/kakao.svg";
import { LinearGradient } from "expo-linear-gradient";

const SCREEN_WIDTH = Dimensions.get("window").width; // 화면 가로 크기

export default function KakaoLoginScreen({ navigation }) {
  const [activePage, setActivePage] = useState(0); // 현재 페이지 상태

  // 스크롤 시 페이지 감지
  const handleScroll = (e) => {
    const pageNumber = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActivePage(pageNumber);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
          >
            <View
              style={{
                ...styles.imageContainer,
                backgroundColor: theme.yellow25,
              }}
            >
              <Image
                source={require("../assets/LoginImage.png")}
                style={styles.phone}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                ...styles.imageContainer,
                backgroundColor: theme.yellow25,
              }}
            >
              <Image
                source={require("../assets/LoginImage.png")}
                style={styles.phone}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                ...styles.imageContainer,
                backgroundColor: theme.yellow25,
              }}
            >
              <Image
                source={require("../assets/LoginImage.png")}
                style={styles.phone}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                ...styles.imageContainer,
                backgroundColor: theme.yellow25,
              }}
            >
              <Image
                source={require("../assets/LoginImage.png")}
                style={styles.phone}
                resizeMode="contain"
              />
            </View>
          </ScrollView>
          {/* 그라데이션 그림자 효과 */}
          <LinearGradient
            colors={["transparent", "#00000005", "#00000010"]}
            style={styles.shadowGradient}
          />
        </View>
        <View style={styles.subContainer}>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            {[...Array(4)].map((_, index) => (
              <FontAwesome
                key={index}
                name="circle"
                size={10}
                color={activePage === index ? theme.green500 : theme.grey200} // 현재 페이지에 맞춰 색상 변경
                style={{ marginHorizontal: 6 }}
              />
            ))}
          </View>
          <Text style={{ ...styles.title, marginBottom: 8 }}>
            하루기록/음성기록
          </Text>
          <Text style={styles.subText}>
            증상체크부터 부모행동까지 기록을 한번에!
          </Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{ ...styles.button, marginBottom: 20 }}
      >
        <WithLocalSvg asset={Kakao} />
        <Text style={{ ...styles.buttonText, marginLeft: 9 }}>
          카카오 로그인
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 430,
    alignItems: "center",
  },
  phone: {
    marginTop: 80,
    width: 194,
    height: 410,
    borderWidth: 4,
    borderColor: theme.grey500,
    borderRadius: 12,
  },
  subContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Pretendard-Bold",
    color: theme.green600,
  },
  subText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 312,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FEE500",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    color: "#000000D9",
  },
  shadowGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // 뷰의 아래쪽에 위치
    height: 10, // 그림자 높이
  },
});
