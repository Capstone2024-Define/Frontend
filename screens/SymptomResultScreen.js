import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";

const resultImages = {
  최고예요: require("../assets/high.png"), // 최고예요 이미지 경로
  보통이에요: require("../assets/medium.png"), // 보통이에요 이미지 경로
  아쉬워요: require("../assets/low.png"), // 아쉬워요 이미지 경로
};

export default function SymptomResultScreen({ route, navigation }) {
  const { selectedCount } = route.params;
  //console.log(selectedCount);

  let resultText = "";
  let resultImage = null;

  if (selectedCount <= 3) {
    resultText = "최고예요!";
    resultImage = resultImages["최고예요"];
  } else if (selectedCount <= 9) {
    resultText = "보통이에요!";
    resultImage = resultImages["보통이에요"];
  } else {
    resultText = "아쉬워요!";
    resultImage = resultImages["아쉬워요"];
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="이전"
        title="되돌아보기 결과"
        right="다음"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={() => {
          navigation.push("SymptomCheckParent", {
            date: route.params.date,
            symptomList: route.params.symptomList,
          });
        }}
        line={false}
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
        <Image source={resultImage} style={styles.resultImage} />
        <Text style={styles.resultText}>오늘 지현님은</Text>
        <Text style={styles.resultTextHighlight}>{resultText}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEFDF9",
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
    width: 250,
    height: 250,
  },
  resultText: {
    fontSize: 16,
    color: "#242424",
    fontFamily: "Pretendard-Medium",
  },
  resultTextHighlight: {
    fontSize: 16,
    color: theme.green500,
    fontFamily: "Pretendard-Bold",
    marginTop: 4,
    marginBottom: 40,
  },
});
