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
import { useState, useEffect, useRef } from "react";
import { theme } from "../colors/color";
import { FontAwesome } from "@expo/vector-icons";
import { WithLocalSvg } from "react-native-svg/css";
import Kakao from "../assets/kakao.svg";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-reanimated-carousel";

const SCREEN_WIDTH = Dimensions.get("window").width; // 화면 가로 크기

export default function KakaoLoginScreen({ navigation }) {
  const [activePage, setActivePage] = useState(0); // 현재 페이지 상태
  const scrollViewRef = useRef(null);
  const title = ["하루기록/음성기록", "정보", "캘린더", "내보내기"];
  const contentTop = [
    "ADHD 증상체크부터",
    "ADHD에 대한 정보를 제공하고",
    "기록한 내용을 날짜별로 확인하고,",
    "기록한 내용을 치료에",
  ];
  const contentBottom = [
    "부모행동까지 기록을 한번에!",
    "챗봇으로 정보 탐색을 도와드려요",
    "분석된 그래프를 제공해요",
    "활용할 수 있도록 문서화해드려요!",
  ];

  const images = [
    require("../assets/LoginImage1.png"),
    require("../assets/LoginImage2.png"),
    require("../assets/LoginImage3.png"),
    require("../assets/LoginImage4.png"),
  ];

  // 이미지 4배
  const extendedImages = [...images, ...images, ...images, ...images];

  // 스크롤 시 페이지 감지
  const handleScroll = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const currentIndex =
      Math.round(offsetX / SCREEN_WIDTH) % extendedImages.length;
    setActivePage(currentIndex); // 페이지 업데이트
  };

  // 5초마다 자동으로 스크롤
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (activePage + 1 >= extendedImages.length) {
  //       scrollViewRef.current.scrollTo({ x: 0, animated: true });
  //       setActivePage(0);
  //     } else {
  //       scrollViewRef.current.scrollTo({
  //         x: SCREEN_WIDTH * (activePage + 1),
  //         animated: true,
  //       });
  //     }
  //   }, 5000);

  //   return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
  // }, [activePage]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.imageContainer}>
          {/* <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
          >
            {extendedImages.map((image, index) => (
              <View
                key={index}
                style={{
                  ...styles.imageContainer,
                  backgroundColor: theme.yellow25,
                }}
              >
                <Image
                  source={image}
                  style={styles.phone}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView> */}
          <Carousel
            loop
            width={SCREEN_WIDTH}
            height={396}
            data={images}
            autoPlay={true}
            pagingEnabled={true}
            scrollAnimationDuration={1000} // 애니메이션 속도
            autoPlayInterval={4000} // 스크롤 속도
            onSnapToItem={(index) => setActivePage(index)}
            renderItem={({ index }) => (
              <View
                key={index}
                style={{
                  ...styles.imageContainer,
                  backgroundColor: theme.yellow25,
                }}
              >
                <Image
                  source={images[index]}
                  style={styles.phone}
                  resizeMode="contain"
                />
              </View>
            )}
          />
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
            {title[activePage]}
          </Text>
          <Text style={styles.subText}>{contentTop[activePage]}</Text>
          <Text style={styles.subText}>{contentBottom[activePage]}</Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => navigation.navigate("KakaoLoginWeb")}
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
    height: 396,
    alignItems: "center",
  },
  phone: {
    marginTop: 47,
    width: 194,
    height: 410,
    borderWidth: 4,
    borderColor: theme.grey500,
    borderRadius: 8,
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
    color: theme.grey600,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 320,
    height: 56,
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
