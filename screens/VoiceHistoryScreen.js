import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";

const resultImages = {
  최고예요: require("../assets/high.png"), // 최고예요 이미지 경로
  보통이에요: require("../assets/medium.png"), // 보통이에요 이미지 경로
  아쉬워요: require("../assets/low.png"), // 아쉬워요 이미지 경로
};

export default function SymptomResult({ route, navigation }) {
  const { selectedCount } = route.params;

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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="되돌아보기 결과"
        right="다음"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={() => {
          // Add navigation to next screen if needed
        }}
        line={false}
      />
      <View style={styles.container}>
        <Image source={resultImage} style={styles.resultImage} />
        <Text style={styles.resultText}>오늘 지현님은</Text>
        <Text style={styles.resultTextHighlight}>{resultText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    color: "#242424",
  },
  resultTextHighlight: {
    fontSize: 18,
    color: theme.green500,
  },
});
