import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";

const VoiceRecordScreen = ({ navigation }) => {
  const [isSchoolSelected, setIsSchoolSelected] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState("0:00");

  const toggleCategory = () => {
    setIsSchoolSelected(!isSchoolSelected);
  };

  const startRecording = () => {
    // 녹음 시작 로직
    setRecording(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="음성기록"
        onLeftPress={() => navigation.popToTop()}
        line={true}
      />
      <View style={styles.container}>
        <Text style={styles.headerText}>음성기록</Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              isSchoolSelected && styles.categoryButtonSelected,
            ]}
            onPress={toggleCategory}
          >
            <Text
              style={
                isSchoolSelected
                  ? styles.categoryTextSelected
                  : styles.categoryText
              }
            >
              학교
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              !isSchoolSelected && styles.categoryButtonSelected,
            ]}
            onPress={toggleCategory}
          >
            <Text
              style={
                !isSchoolSelected
                  ? styles.categoryTextSelected
                  : styles.categoryText
              }
            >
              병원
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.infoText}>
          우리 아이의 학교 관련 기록을 음성으로 기록해요!
        </Text>
        <Text style={styles.infoSubText}>
          음성을 텍스트로 변환 기록되고 기록된 내용은 상세 기록에 자동으로
          추가돼요
        </Text>
        <Text style={styles.recordingPrompt}>
          녹음 버튼을 눌러서 기록을 시작하세요!
        </Text>
        <Text style={styles.recordingTime}>{recordingTime}</Text>
        <View style={styles.recordingIcons}>
          <Text>🔊</Text>
          <Text>➡️</Text>
          <Text>📄</Text>
        </View>
        <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
          <Text style={styles.recordButtonText}>녹음 시작</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.progressLeft} />
        <View style={styles.progressRight} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#eee",
    alignItems: "center",
    borderRadius: 20,
  },
  categoryButtonSelected: {
    backgroundColor: "#000",
  },
  categoryText: {
    color: "#000",
  },
  categoryTextSelected: {
    color: "#fff",
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  infoSubText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  recordingPrompt: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  recordingTime: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  recordingIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginBottom: 16,
  },
  recordButton: {
    backgroundColor: "#aaa",
    padding: 10,
    borderRadius: 20,
  },
  recordButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  progressLeft: {
    width: "50%",
    height: 4,
    backgroundColor: theme.green500,
  },
  progressRight: {
    width: "50%",
    height: 4,
    backgroundColor: theme.grey150,
  },
});

export default VoiceRecordScreen;
