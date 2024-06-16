import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Header from '../component/Header';
import { theme } from '../colors/color';

const symptoms = {
  행동조작: ['불순응', '반항', '떼쓰기'],
  언어조작: ['자기연민성발언', '부정적인발언', '폐병', '조르기', '끼어들기'],
  부주의: ['학교성적부진', '읽기능력부진', '주의력결핍', '무기력', '빈둥거리기'],
  기타: ['고자질', '가족과다툼', '공격성', '거짓말'],
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
      <View key={category}>
        <Text style={styles.categoryText}>{category}</Text>
        <View style={styles.buttonContainer}>
          {symptoms.map((symptom) => (
            <TouchableOpacity
              key={symptom}
              style={[
                styles.symptomButton,
                selectedSymptoms.includes(symptom) && styles.symptomButtonSelected,
              ]}
              onPress={() => toggleSymptom(symptom)}
            >
              <Text
                style={[
                  styles.symptomButtonText,
                  selectedSymptoms.includes(symptom) && styles.symptomButtonTextSelected,
                ]}
              >
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const handleNextPress = () => {
    navigation.push("SymptomResult", {
      selectedCount: selectedSymptoms.length,
      checkList: selectedSymptoms,
      date: route.params.date,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="되돌아보기"
        right="다음"
        onLeftPress={() => {
          navigation.popToTop();
        }}
        onRightPress={handleNextPress}
        line={false}
      />
      <View style={styles.progressBar}>
        <View style={styles.progressBarActive} />
        <View style={styles.progressBarInactive} />
      </View>
      <View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
        <Text style={styles.mainTitle}>
          먼저 아이의{'\n'}
          증상을 체크해주세요
        </Text>
        <Text style={styles.subTitle}>증상이 없었을 경우 선택하지 않고 다음을 눌러주세요</Text>
        {Object.entries(symptoms).map(([category, symptoms]) =>
          renderSymptoms(category, symptoms)
        )}
      </View>
    </View>
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
    backgroundColor: theme.green500,
  },
  progressBarInactive: {
    width: "67%",
    backgroundColor: theme.grey150,
  },
  mainTitle: {
    marginTop: 28,
    color: "#242424",
    fontSize: 18,
    marginBottom: 8,
    marginHorizontal: 25,
    lineHeight: 24,
    fontFamily: "pretendard",
    fontWeight: "500",
  },
  subTitle: {
    color: "#A5A5A5",
    fontSize: 12,
    marginBottom: 20,
    marginLeft: 25,
    fontFamily: "pretendard",
    fontWeight: "500",
  },
  categoryText: {
    color: "#242424",
    fontSize: 16,
    marginBottom: 15,
    marginLeft: 25,
    lineHeight: 24,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 21,
    marginHorizontal: 24,
  },
  symptomButton: {
    backgroundColor: "#F6F6F6",
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginRight: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  symptomButtonSelected: {
    backgroundColor: "#78BA7D",
  },
  symptomButtonText: {
    color: "#333333",
    fontSize: 14,
  },
  symptomButtonTextSelected: {
    color: "#FFFFFF",
  },
});

export default SymptomCheckScreen;
