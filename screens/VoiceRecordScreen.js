import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import Header from "../component/Header";

const VoiceRecordScreen = ({ navigation, route }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingUri, setRecordingUri] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [mode, setMode] = useState('school');

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();

      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();

      setRecording(recording);
      setIsRecording(true);
      const id = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      setIsRecording(false);
      clearInterval(intervalId);
      setIntervalId(null);
      setRecordingTime(0);
    }
  };

  const pauseRecording = async () => {
    console.log('Pausing recording..');
    if (recording) {
      await recording.pauseAsync();
      setIsPaused(true);
      clearInterval(intervalId);
    }
  };

  const resumeRecording = async () => {
    console.log('Resuming recording..');
    if (recording) {
      await recording.startAsync();
      setIsPaused(false);
      const id = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="음성기록"
        right="다음"
        onLeftPress={() => {
          navigation.popToTop();
        }}
        onRightPress={() =>
          navigation.push("SymptomResult", {
            selectedCount: selectedChecklistItems.length,
            date: route.params.date,
          })
        }
        line={false}
      />
      <SafeAreaView style={styles.safeArea}>
       
    
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{"음성을 녹음하면\n텍스트로 변환해요"}</Text>
            <View style={styles.modeSwitcher}>
              <TouchableOpacity onPress={() => setMode('school')} style={mode === 'school' ? styles.activeMode : styles.inactiveMode}>
                <Text style={mode === 'school' ? styles.activeModeText : styles.inactiveModeText}>{"학교"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode('hospital')} style={mode === 'hospital' ? styles.activeMode : styles.inactiveMode}>
                <Text style={mode === 'hospital' ? styles.activeModeText : styles.inactiveModeText}>{"병원"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.recordingHint}>{"녹음을 하면 글로 기록이 되고\n기록된 내용은 상세기록에 추가돼요"}</Text>
          <Text style={styles.timer}>{formatTime(recordingTime)}</Text>
          <View style={styles.separator} />
          <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={styles.recordButton}>

            <Text style={styles.recordButtonText}>{isRecording ? "녹음정지" : "녹음시작"}</Text>
          </TouchableOpacity>
       
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FEFCF8",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEFCF4",
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  titleText: {
    color: "#242424",
    fontSize: 16,
    flex: 1,
  },
  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 24,
  },
  descriptionText: {
    color: "#242424",
    fontSize: 18,
    width: 127,
  },
  modeSwitcher: {
    width: 138,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  activeMode: {
    width: 63,
    alignItems: "center",
    backgroundColor: "#78BA7D",
    borderRadius: 30,
    paddingVertical: 9,
  },
  inactiveMode: {
    width: 63,
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 30,
    paddingVertical: 9,
  },
  activeModeText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  inactiveModeText: {
    color: "#A5A5A5",
    fontSize: 14,
  },
  recordingHint: {
    color: "#A5A5A5",
    fontSize: 12,
    marginBottom: 124,
    marginHorizontal: 24,
    width: 312,
  },
  timer: {
    color: "#8B8B8B",
    fontSize: 36,
    marginBottom: 55,
    marginLeft: 142,
  },
  separator: {
    height: 1,
    backgroundColor: "#A5D1A9",
    marginBottom: 98,
  },
  recordButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#78BA7D",
    borderRadius: 24,
    paddingVertical: 13,
    marginBottom: 93,
    marginHorizontal: 106,
  },
  recordIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  recordButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default VoiceRecordScreen;
