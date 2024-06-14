import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import Header from "../component/Header";
import { theme } from "../colors/color";

const VoiceRecordScreen = ({ navigation, route }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [mode, setMode] = useState('school');

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const startRecording = () => {
    setIsRecording(true);
    const id = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(intervalId);
    setIntervalId(null);
    setRecordingTime(0);
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
            // selectedCount: selectedChecklistItems.length,
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
        <View style={styles.timerContainer}>
          {isRecording && <Image source={require('../assets/recordgreen.png')} style={styles.timerIcon} />}
          <Text style={[styles.timer, isRecording && styles.timerRecording]}>{formatTime(recordingTime)}</Text>
        </View>
        <View style={styles.waveformContainer}>
          {isRecording ? (
            <>
              <Image source={require('../assets/wave.png')} style={styles.waveformImage} />
            </>
          ) : (
            <View style={styles.waveformLine} />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={isRecording ? styles.recordButtonStop : styles.recordButtonStart}>
            <Image source={isRecording ? require('../assets/pause.png') : require('../assets/graphic_eq.png')} style={styles.recordIcon} />
            <Text style={isRecording ? styles.recordButtonTextStop : styles.recordButtonTextStart}>{isRecording ? "녹음정지" : "녹음시작"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.progressLeft} />
        <View style={styles.progressRight} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 30,
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
    marginBottom: 20,
    marginHorizontal: 24,
    width: 312,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 100,
  },
  timer: {
    color: "#8B8B8B",
    fontSize: 36,
    fontFamily: "Pretendard-Bold",
    marginBottom: 30,
  },
  timerRecording: {
    color: "#000000",
    marginLeft: 8,
  },
  timerIcon: {
    width: 15,
    height: 15,
    marginRight: 8,
    marginBottom:30,
  },
  waveformContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  waveformLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#78BA7D',
    marginTop: 30,
    marginBottom: 100,
  },
  waveformImage: {
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 100,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 93,
  },
  recordButtonStart: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#78BA7D",
    borderRadius: 24,
    paddingVertical: 13,
    width: 147,
    height: 44,
  },
  recordButtonStop: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#79BA7E",
    borderRadius: 24,
    paddingVertical: 13,
    width: 147,
    height: 44,
  },
  recordButtonTextStart: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  recordButtonTextStop: {
    color: "#79BA7E",
    fontSize: 14,
  },
  recordIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
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
