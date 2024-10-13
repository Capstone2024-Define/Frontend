import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { bottomBtn } from "../component/BottomButton";

const resultImages = {
  최고예요: require("../assets/highStroke.png"), // 최고예요 이미지 경로
  보통이에요: require("../assets/mediumStroke.png"), // 보통이에요 이미지 경로
  아쉬워요: require("../assets/lowStroke.png"), // 아쉬워요 이미지 경로
};

export default function SymptomResultScreen({ route, navigation }) {
  const { selectedCount } = route.params;

  let resultText = "";
  let resultImage = null;
  let state = 0;

  if (selectedCount <= 3) {
    resultText = "최고예요!";
    resultImage = resultImages["최고예요"];
    state = 2;
  } else if (selectedCount <= 9) {
    resultText = "보통이에요!";
    resultImage = resultImages["보통이에요"];
    state = 1;
  } else {
    resultText = "아쉬워요!";
    resultImage = resultImages["아쉬워요"];
    state = 0;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="되돌아보기 결과"
        onLeftPress={() => {
          navigation.pop();
        }}
      />
      <View style={styles.progressView}>
        <LinearGradient
          colors={["#79BA7E", "#AFCA85"]}
          style={{ width: "33%" }}
          start={{ x: 1, y: 0 }} // 그라데이션의 시작 지점 (오른쪽)
          end={{ x: 0, y: 0 }} // 그라데이션의 끝 지점 (왼쪽)
        >
          <View style={styles.progressLeft}></View>
        </LinearGradient>
        <View style={styles.progressRight}></View>
      </View>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 30,
          }}
        >
          <Image source={resultImage} style={styles.resultImage} />
          <Text style={styles.resultText}>오늘 지현님은</Text>
          <Text style={styles.resultTextHighlight}>{resultText}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.push("SymptomCheckParent", {
              date: route.params.date,
              symptomList: route.params.symptomList,
              state: state,
              user_code: route.params.user_code,
              ipnumber: route.params.ipnumber,
            });
          }}
          style={{ marginBottom: 20 }}
        >
          <LinearGradient
            colors={["#79BA7E", "#AFCA85"]}
            style={bottomBtn.button}
          >
            <Text style={bottomBtn.buttonText}>다음</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
  progressView: {
    flexDirection: "row",
    width: "100%",
    height: 4,
  },
  progressLeft: {
    width: "33%",
    backgroundColor: "transparent",
  },
  progressRight: {
    width: "67%",
    backgroundColor: theme.grey150,
  },
  resultImage: {
    //250
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    color: "#242424",
    fontFamily: "Pretendard-Medium",
  },
  resultTextHighlight: {
    fontSize: 20,
    lineHeight: 30,
    color: theme.green500,
    fontFamily: "Pretendard-Bold",
    marginTop: 4,
    marginBottom: 40,
  },
});
