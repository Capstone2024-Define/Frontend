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
<<<<<<< HEAD
      <View style={styles.container}>
        <Image source={resultImage} style={styles.resultImage} />
        <Text style={styles.resultText}>오늘 지현님은</Text>
        <Text style={styles.resultTextHighlight}>{resultText}</Text>
=======
      <View style={styles.subContainer}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInput}
              placeholder="내용으로 검색할수있어요"
              placeholderTextColor={theme.grey400}
            />
            <TouchableOpacity activeOpacity={0.5} style={styles.search}>
              <WithLocalSvg width={24} height={24} asset={Search} />
            </TouchableOpacity>
          </View>
          <View style={styles.filterView}>
            <FilterButton
              text="전체"
              onPress={() => setFilter("all")}
              onOff={filter === "all" ? "on" : "off"}
              textColor={filter === "all" ? "white" : theme.grey300}
            />
            <FilterButton
              text="학교"
              onPress={() => setFilter("school")}
              onOff={filter === "school" ? "on" : "off"}
              textColor={filter === "school" ? "white" : theme.grey300}
            />
            <FilterButton
              text="병원"
              onPress={() => setFilter("hospital")}
              onOff={filter === "hospital" ? "on" : "off"}
              textColor={filter === "hospital" ? "white" : theme.grey300}
            />
          </View>
        </View>
        <ScrollView style={styles.scroll}>
          <VoiceDateButton
            place="학교"
            onPress={() => navigation.push("DetailVoice", { detail: false })}
          />
          <VoiceDateButton
            place="병원"
            onPress={() => navigation.push("DetailVoice", { detail: false })}
          />
          <VoiceDateButton
            place="병원"
            onPress={() => navigation.push("DetailVoice", { detail: false })}
          />
          <View style={{ marginBottom: 30 }} />
        </ScrollView>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.progressLeft} />
        <View style={styles.progressRight} />
>>>>>>> 3ae1c84c3d8e9e7a9f3d3a7c6d2b3af244d236e2
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
=======
    backgroundColor: "white",
>>>>>>> 3ae1c84c3d8e9e7a9f3d3a7c6d2b3af244d236e2
    justifyContent: "center",
    alignItems: "center",
  },
  resultImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
<<<<<<< HEAD
  resultText: {
    fontSize: 18,
    color: "#242424",
  },
  resultTextHighlight: {
    fontSize: 18,
    color: theme.green500,
=======
  headerContainer: {
    paddingTop: 28,
  },
  textInput: {
    width: 312,
    paddingVertical: 8,
    paddingLeft: 50,
    paddingRight: 16,
    backgroundColor: theme.grey100,
    borderRadius: 24,
    fontSize: 12,
    fontFamily: "Pretendard-Medium",
  },
  search: {
    position: "absolute",
    top: 10, // 이미지의 상단에서 10포인트 떨어진 위치
    right: 270,
  },

  filterView: {
    flexDirection: "row",
    marginVertical: 16,
  },
  progressLeft: {
    width: "50%",
    height: 4,
    backgroundColor: theme.grey150,
  },
  progressRight: {
    width: "50%",
    height: 4,
    backgroundColor: theme.green500,
>>>>>>> 3ae1c84c3d8e9e7a9f3d3a7c6d2b3af244d236e2
  },
});
