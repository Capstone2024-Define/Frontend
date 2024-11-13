import { Image, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ route }) {
  const navigation = useNavigation();
  const ipnumber = route.params.ipnumber;

  // 초기 크기, 위치, 너비
  const scale = useSharedValue(0.0);
  const translateX = useSharedValue(0);
  const textTranslateX = useSharedValue(-400);
  // const textWidth = useSharedValue(0);

  // 애니메이션 스타일 정의
  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateX: translateX.value }],
    };
  });
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: textTranslateX.value }],
    };
  });
  // const textAnimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     width: textWidth.value,
  //     overflow: "hidden", // 텍스트가 컨테이너 밖으로 넘치지 않게
  //   };
  // });

  useEffect(() => {
    // 유저 상태 확인
    const CheckUserState = async () => {
      try {
        const savedUserCode = await AsyncStorage.getItem("user_code");
        const currentState = await AsyncStorage.getItem("state");

        if (savedUserCode !== null) {
          console.log("user_code: ", Number(savedUserCode));
          console.log("현재 state: ", currentState);
          if (currentState === "login") {
            // login 상태 => 바로 메인
            navigation.replace("Main", {
              user_code: Number(savedUserCode),
              ipnumber: ipnumber,
              showTutorial: false,
            });
          } else {
            // logout 상태 => 재로그인
            navigation.replace("KakaoLogin", { ipnumber: ipnumber });
          }
        } else {
          console.log("첫가입");
          await AsyncStorage.setItem("state", "first");
          navigation.replace("KakaoLogin", { ipnumber: ipnumber });
        }
      } catch (error) {
        console.log("유저 상태 확인 중 에러:", error);
      }
    };

    // 애니메이션
    scale.value = withSequence(
      withTiming(0.4, { duration: 350, easing: Easing.out(Easing.ease) }), // 커지게
      withTiming(0.24, { duration: 200, easing: Easing.inOut(Easing.ease) }) // 다시 작아지게
    );

    translateX.value = withDelay(
      700,
      withTiming(-330, { duration: 500, easing: Easing.out(Easing.ease) }) // 왼쪽으로 이동
    );

    textTranslateX.value = withDelay(
      1300,
      withTiming(-150, { duration: 500, easing: Easing.out(Easing.ease) }) // 왼쪽으로 이동
    );

    // textWidth.value = withDelay(
    //   1300,
    //   withTiming(130, { duration: 500, easing: Easing.out(Easing.ease) }) // 0%에서 100%로 점진적으로 증가
    // );

    const timer = setTimeout(async () => {
      await CheckUserState();
      // navigation.replace("Main", {
      //   user_code: Number(savedUserCode),
      //   ipnumber: ipnumber,
      //   showTutorial: false,
      // });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#79BA7E", "#AFCA85"]}
      style={{ flex: 1, paddingBottom: 50 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#79BA7E" />
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image source={require("../assets/splash/clobit_logo.png")} />
        </Animated.View>
        <View style={styles.textContainer}>
          <Animated.View style={[textAnimatedStyle]}>
            <Image
              source={require("../assets/splash/clobit_text.png")}
              style={styles.textImage}
            />
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  textContainer: {
    position: "absolute", // 화면 가운데 고정
    transform: [{ translateX: 15 }],
    width: 140,
    height: 36,
    overflow: "hidden",
  },
  textImage: {
    transform: [{ translateX: 0 }],
    height: "100%",
    resizeMode: "contain",
  },
});
