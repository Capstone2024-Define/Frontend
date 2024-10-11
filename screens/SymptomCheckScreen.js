import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { bottomBtn } from "../component/BottomButton";

const symptoms = {
  행동조작: ["불순응", "반항", "떼쓰기"],
  언어조작: ["자기연민성발언", "부정적인발언", "꾀병", "조르기", "끼어들기"],
  부주의: [
    "학교성적부진",
    "읽기능력부진",
    "주의력결핍",
    "무기력",
    "빈둥거리기",
  ],
  기타: ["고자질", "가족과다툼", "공격성", "거짓말"],
};

const SymptomCheckScreen = ({ route, navigation }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prevSelected) =>
      prevSelected.includes(symptom)
        ? prevSelected.filter((s) => s !== symptom)
        : [...prevSelected, symptom]
    );
  };

  const renderSymptoms = (category, symptoms) => {
    return (
      <SafeAreaView key={category}>
        <Text style={styles.categoryText}>{category}</Text>
        <View style={styles.buttonContainer}>
          {symptoms.map((symptom) => (
            <TouchableOpacity
              key={symptom}
              style={[
                styles.symptomButton,
                selectedSymptoms.includes(symptom) &&
                  styles.symptomButtonSelected,
              ]}
              onPress={() => toggleSymptom(symptom)}
            >
              <Text
                style={[
                  styles.symptomButtonText,
                  selectedSymptoms.includes(symptom) &&
                    styles.symptomButtonTextSelected,
                ]}
              >
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  };

  const handleNextPress = () => {
    navigation.push("SymptomResult", {
      selectedCount: selectedSymptoms.length,
      symptomList: selectedSymptoms,
      date: route.params.date,
      user_code: route.params.user_code,
      ipnumber: route.params.ipnumber,
    });
  };

  // 체크리스트를 [0,1,1,0,..] 바꿈
  // const formatSymptomList = () => {
  //   const symptomList = [
  //     "불순응",
  //     "반항",
  //     "떼쓰기",
  //     "자기연민성발언",
  //     "부정적인발언",
  //     "꾀병",
  //     "조르기",
  //     "끼어들기",
  //     "학교성적부진",
  //     "읽기능력부진",
  //     "주의력결핍",
  //     "무기력",
  //     "빈둥거리기",
  //     "고자질",
  //     "가족과다툼",
  //     "공격성",
  //     "거짓말",
  //   ];
  //   const newSymptomList = Array(symptomList.length).fill(0);

  //   console.log(selectedSymptoms);
  //   symptomList.forEach((symptom, index) => {
  //     if (selectedSymptoms.includes(symptom)) {
  //       newSymptomList[index] = 1;
  //     }
  //   });
  //   console.log(newSymptomList);

  //   return newSymptomList;
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="증상체크"
        onLeftPress={() => {
          navigation.popToTop();
        }}
        line={false}
      />
      <View style={styles.progressBar}>
        <LinearGradient
          colors={["#79BA7E", "#AFCA85"]}
          style={{ width: "33%" }}
          start={{ x: 1, y: 0 }} // 그라데이션의 시작 지점 (오른쪽)
          end={{ x: 0, y: 0 }} // 그라데이션의 끝 지점 (왼쪽)
        >
          <View style={styles.progressBarActive} />
        </LinearGradient>
        <View style={styles.progressBarInactive} />
      </View>
      <View
        style={{
          backgroundColor: "#FFFFFF",
          flex: 1,
          alignItems: "center",
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <Text style={styles.mainTitle}>
            먼저 아이의{"\n"}
            증상을 체크해주세요
          </Text>
          <Text style={styles.subTitle}>
            증상이 없었을 경우 선택하지 않고{"\n"}다음을 눌러주세요
          </Text>
          {Object.entries(symptoms).map(([category, symptoms]) =>
            renderSymptoms(category, symptoms)
          )}
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <TouchableOpacity activeOpacity={0.5} onPress={handleNextPress}>
            <LinearGradient
              colors={["#79BA7E", "#AFCA85"]}
              style={bottomBtn.button}
            >
              <Text style={bottomBtn.buttonText}>다음</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: "row",
    height: 4,
    backgroundColor: theme.grey150,
  },
  progressBarActive: {
    width: "33%",
    backgroundColor: "transparent",
  },
  progressBarInactive: {
    width: "67%",
    backgroundColor: theme.grey150,
  },
  mainTitle: {
    marginTop: 20,
    color: "#242424",
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 4,
    marginHorizontal: 20,
    fontFamily: "Pretendard-Bold",
  },
  subTitle: {
    color: "#A5A5A5",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    marginLeft: 20,
    fontFamily: "Pretendard-Regular",
  },
  categoryText: {
    color: "#242424",
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 20,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
    marginHorizontal: 20,
  },
  symptomButton: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  symptomButtonSelected: {
    backgroundColor: theme.green50,
    borderWidth: 1,
    borderColor: theme.green500,
  },
  symptomButtonText: {
    color: theme.grey500,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
  },
  symptomButtonTextSelected: {
    color: theme.green500,
    fontFamily: "Pretendard-Bold",
  },
});

export default SymptomCheckScreen;
