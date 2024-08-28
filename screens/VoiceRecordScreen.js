import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { Audio } from "expo-av";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../component/Toast";

const VoiceRecordScreen = ({ navigation, route }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [mode, setMode] = useState("school");
  const [recording, setRecording] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [transcriptArray, setTranscriptArray] = useState([]);
  const recordingRef = useRef(null);

  // 기록 관련
  const today = route.params.date; // 날짜

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const startRecording = async () => {
    if (isRecording || recordingRef.current) {
      console.warn("A recording is already in progress.");
      return;
    }

    try {
      await Audio.requestPermissionsAsync();

      // 오디오 모드 설정
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      recordingRef.current = recording;
      setRecording(recording);
      setIsRecording(true);
      setIsPaused(false);
      const id = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!isRecording) {
      console.warn("No recording in progress to stop.");
      return;
    }

    try {
      console.log("Stopping recording..");
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      console.log("Recording stopped and stored at", uri);

      const info = await FileSystem.getInfoAsync(uri);
      console.log("Recording file info:", info);

      if (info.size > 0) {
        const transcript = await sendToGoogleSTT(uri);
        setTranscriptArray((prevArray) => [...prevArray, transcript]);
        setIsPaused(true);
        setIsRecording(false);
        clearInterval(intervalId);
        setIntervalId(null);
        recordingRef.current = null;
      } else {
        console.error("Recording file is empty");
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  // 음성 다시 듣기
  // const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
  // await sound.playAsync();

  const sendToGoogleSTT = async (fileUri) => {
    try {
      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // API 요청 본문 구성
      const requestBody = {
        audio: {
          content: fileData,
        },
        config: {
          encoding: "AMR",
          sampleRateHertz: 8000,
          languageCode: "ko-KR",
          enableAutomaticPunctuation: true,
        },
      };

      // API 요청 보내기
      const response = await axios.post(
        "https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyDpZWLbf5duRAjcGtgC6DKz4BolApSGfPo",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Response from Google STT:",
        response.data.results[0].alternatives[0].transcript
      );

      if (response.data && response.data.results) {
        const transcription = response.data.results
          .map((result) => result.alternatives[0].transcript)
          .join("\n");

        return transcription;
      } else {
        console.error("Unexpected response format:", response.data);
        return "";
      }
    } catch (err) {
      console.error("Failed to send to Google STT", err);
      return "";
    }
  };

  const handleComplete = async () => {
    const finalTranscript = transcriptArray.join(" ");
    const time = getTime();
    const newVoice = {
      date: today,
      place: mode,
      time: time,
      text: finalTranscript,
    };
    //console.log(newVoice);

    // 스토리지 저장
    await save(newVoice);
    setTranscriptArray([]);
    setRecordingTime(0);
    setIsPaused(false);
    showToast("기록이 완료되었어요");
    navigation.navigate("VoiceHistory");
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 스토리지에 저장
  const save = async (toSave) => {
    try {
      // 기존 저장된 기록 불러오기
      const rawVoiceList = await AsyncStorage.getItem("voice");
      let voiceList = [];
      if (rawVoiceList) {
        try {
          voiceList = JSON.parse(rawVoiceList);
        } catch (parseError) {
          console.error("JSON 파싱 에러:", parseError);
        }
      }

      //console.log("기존 기록 내용:", voiceList);

      // 새로운 기록 추가
      voiceList.push(toSave);
      //console.log("새로운 기록이 추가된 리스트:", voiceList);

      // 기록 저장
      await AsyncStorage.setItem("voice", JSON.stringify(voiceList));
      //console.log("기록 저장 성공:", voiceList);
    } catch (error) {
      console.error("기록 저장 에러:", error);
    }
  };

  // 녹음 시간 구하기
  const getTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${period} ${formattedHours}:${formattedMinutes}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="음성기록"
        onLeftPress={() => {
          navigation.popToTop();
        }}
        onRightPress={() =>
          navigation.push("SymptomResult", {
            date: route.params.date,
          })
        }
        line={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {"음성을 녹음하면\n텍스트로 변환해요"}
          </Text>
          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              onPress={() => setMode("school")}
              style={
                mode === "school" ? styles.activeMode : styles.inactiveMode
              }
            >
              <Text
                style={
                  mode === "school"
                    ? styles.activeModeText
                    : styles.inactiveModeText
                }
              >
                {"학교"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode("hospital")}
              style={
                mode === "hospital" ? styles.activeMode : styles.inactiveMode
              }
            >
              <Text
                style={
                  mode === "hospital"
                    ? styles.activeModeText
                    : styles.inactiveModeText
                }
              >
                {"병원"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.recordingHint}>
          {"녹음을 하면 글로 기록이 되고\n기록된 내용은 상세기록에 추가돼요"}
        </Text>
        <View style={styles.timerContainer}>
          {(isRecording || isPaused) && (
            <View style={styles.indicator(isRecording)} />
          )}
          <Text
            style={[
              styles.timer,
              !isRecording && !isPaused && styles.timerInitial,
            ]}
          >
            {formatTime(recordingTime)}
          </Text>
        </View>
        <View style={styles.waveformContainer}>
          {isRecording ? (
            <Image
              source={require("../assets/record_play.gif")}
              style={styles.waveformImage}
            />
          ) : (
            <Image
              source={require("../assets/record_stop.png")}
              style={styles.waveformImage}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          {isPaused ? (
            <>
              <TouchableOpacity
                onPress={startRecording}
                style={styles.recordButtonStart}
              >
                <Text style={styles.recordButtonTextStart}>녹음재개</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleComplete}
                style={styles.completeButton}
              >
                <Text style={styles.completeButtonText}>완료</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              style={
                isRecording ? styles.recordButtonStop : styles.recordButtonStart
              }
            >
              <Image
                source={
                  isRecording
                    ? require("../assets/pause.png")
                    : require("../assets/graphic_eq.png")
                }
                style={styles.recordIcon}
              />
              <Text
                style={
                  isRecording
                    ? styles.recordButtonTextStop
                    : styles.recordButtonTextStart
                }
              >
                {isRecording ? "녹음정지" : "녹음시작"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.progressLeft} />
        <View style={styles.progressRight} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.yellow25,
    paddingTop: 25,
  },
  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginHorizontal: 24,
  },
  descriptionText: {
    color: "#242424",
    fontSize: 17.5,
    width: 127,
    fontFamily: "Pretendard-Medium",
  },
  modeSwitcher: {
    width: 138,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.grey150,
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  activeMode: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 19,
  },
  inactiveMode: {
    alignItems: "center",
    backgroundColor: theme.grey150,
    borderRadius: 30,
    paddingVertical: 6,
    paddingHorizontal: 19,
  },
  activeModeText: {
    color: theme.green500,
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
  },
  inactiveModeText: {
    color: "#A5A5A5",
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
  },
  recordingHint: {
    color: "#A5A5A5",
    fontSize: 12,
    marginBottom: 20,
    marginHorizontal: 24,
    width: 312,
    fontFamily: "Pretendard-Medium",
  },
  timerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 100,
  },
  timer: {
    color: "#333333",
    fontSize: 36,
    fontFamily: "Pretendard-Medium",
  },
  timerRecording: {
    color: "#000000",
  },
  timerInitial: {
    color: "#8B8B8B",
  },
  timerIcon: {
    width: 15,
    height: 15,
    marginRight: 8,
  },
  indicator: (isRecording) => ({
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: isRecording ? "#FF7070" : "#A5A5A5",
    marginRight: 12,
  }),
  waveformContainer: {
    height: 120,
    alignItems: "center",
    marginBottom: 39,
  },
  waveformImage: {
    width: "100%",
    resizeMode: "contain",
    marginBottom: 100,
  },
  buttonContainer: {
    alignItems: "center",
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
    alignItems: "center",
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
  resumeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#78BA7D",
    borderRadius: 24,
    paddingVertical: 13,
    marginBottom: 16,
    marginHorizontal: 106,
    width: 147,
    height: 44,
  },
  resumeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  completeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#F5DE8F",
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 11,
    paddingHorizontal: 36,
    marginBottom: 33,
    marginTop: 16,
  },
  completeButtonText: {
    color: "#F5DE8F",
    fontSize: 14,
  },
  completeIndicator: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: "#FF7070",
    marginRight: 8,
  },
  resumeIndicator: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: "#333333",
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
