import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const symptoms = {
  행동조작: ['불순응', '반항', '떼쓰기'],
  언어조작: ['자기연민성발언', '부정적인발언', '폐병', '조르기', '끼어들기'],
  부주의: ['학교성적부진', '읽기능력부진', '주의력결핍', '무기력', '빈둥거리기'],
  기타: ['고자질', '가족과다툼', '공격성', '거짓말'],
};

export default function SymptomCheckScreen() {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>증상체크</Text>
      <Text style={styles.subtitleText}>0월 0일 우리아이의 증상을 체크해주세요!</Text>
      <Text style={styles.infoText}>
        증상 기록을 기반으로 하루의 증상 단계를 도출해요! 증상이 없었을 경우 선택하지 않고 다음을 눌러주세요
      </Text>
      {Object.entries(symptoms).map(([category, symptoms]) =>
        renderSymptoms(category, symptoms)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  symptomButton: {
    backgroundColor: '#eee',
    padding: 10,
    margin: 4,
    borderRadius: 20,
  },
  symptomButtonSelected: {
    backgroundColor: '#000',
  },
  symptomButtonText: {
    color: '#000',
    fontSize: 16,
  },
  symptomButtonTextSelected: {
    color: '#fff',
  },
});
