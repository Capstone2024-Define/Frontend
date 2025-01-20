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
import { LinearGradient } from "expo-linear-gradient";
import { WithLocalSvg } from "react-native-svg/css";
import Pause from "../assets/pause.svg";
import Mic from "../assets/mic_white.svg";
import Check from "../assets/check.svg";
import { GOOGLE_API_KEY } from "@env";

const GOOGLE_API_KEY = GOOGLE_API_KEY;

const VoiceRecordScreen = ({ navigation, route }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [mode, setMode] = useState("school");
  const [recording, setRecording] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [transcriptArray, setTranscriptArray] = useState([]);
  const recordingRef = useRef(null);
  const [isTranscribing, setIsTranscribing] = useState(false); // STT 진행 중 여부 상태

  // 기록 관련
  const today = route.params.date;
  const { user_code, ipnumber } = route.params;

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  // 녹음 중에 뒤로 나가면 녹음 멈추게함
  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트 될 때 호출
      if (recordingRef.current) {
        console.log("Stopping recording on unmount...");
        stopRecordingAndUnload(); // 녹음 중지 및 정리
      }
    };
  }, []);

  const stopRecordingAndUnload = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
        console.log("Recording stopped and unloaded");
      }
    } catch (error) {
      console.error("Error while stopping and unloading recording", error);
    }
  };

  const startRecording = async () => {
    if (isRecording || recordingRef.current) {
      console.warn("A recording is already in progress.");
      showToast("잠시만 기다려주세요.");
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
    if (!isRecording || !recordingRef.current) {
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
        setIsPaused(true);
        setIsRecording(false);
        clearInterval(intervalId);
        setIntervalId(null);

        // STT
        setIsTranscribing(true);
        const transcript = await sendToGoogleSTT(uri);
        setIsTranscribing(false);
        setTranscriptArray((prevArray) => [...prevArray, transcript]);

        recordingRef.current = null;
      } else {
        console.error("Recording file is empty");
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
      setIsTranscribing(false);
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
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
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
      showToast("녹음이 되지 않았어요.");
      return "";
    }
  };

  const handleComplete = async () => {
    await handlePost(); // 저장
    setTranscriptArray([]);
    setRecordingTime(0);
    setIsPaused(false);
    showToast("기록이 완료되었어요");
    navigation.navigate("VoiceHistory");
  };

  const handlePost = async () => {
    try {
      const finalTranscript = transcriptArray.join(" ");
      const time = getTime();

      console.log(time);

      console.log({
        user_code: user_code,
        timestamp: time,
        location: mode,
        contents: finalTranscript,
      });

      await axios.post(`${ipnumber}:8080/record/post`, {
        user_code: user_code,
        timestamp: time,
        location: mode,
        contents: finalTranscript,
      });
    } catch (error) {
      console.log("POST 에러 : ", error);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 녹음 시간 구하기
  const getTime = () => {
    const todayDate = new Date(today);
    const now = new Date();

    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(todayDate.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // YYYY-MM-DD 시:분:초
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="상담녹음"
        onLeftPress={() => {
          navigation.popToTop();
        }}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {"상담내용을\n녹음으로 기록해요!"}
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
          {"녹음된 내용은 글로 기록돼요"}
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
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../assets/record_play.gif")}
                style={styles.waveformImage}
              />
              <Image
                source={require("../assets/record_play.gif")}
                style={styles.waveformImage}
              />
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../assets/record_stop.png")}
                style={styles.waveformImage}
              />
              <Image
                source={require("../assets/record_stop.png")}
                style={styles.waveformImage}
              />
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {isPaused ? (
            <>
              <LinearGradient
                colors={["#79BA7E", "#AFCA85"]}
                style={styles.recordButtonStart}
              >
                <TouchableOpacity
                  onPress={startRecording}
                  style={{
                    ...styles.recordButtonStart,
                    backgroundColor: "transparent",
                  }}
                >
                  <WithLocalSvg asset={Mic} style={styles.recordIcon} />
                  <Text style={styles.recordButtonTextStart}>녹음재개</Text>
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity
                onPress={() => {
                  if (isTranscribing) {
                    showToast("음성 분석 중입니다. 잠시만 기다려주세요.");
                  } else {
                    handleComplete();
                  }
                }}
                style={styles.completeButton}
              >
                <WithLocalSvg asset={Check} width={18} />
                <Text style={styles.completeButtonText}>완료</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {isRecording ? (
                <TouchableOpacity
                  onPress={stopRecording}
                  style={{ borderRadius: 24 }}
                >
                  <LinearGradient
                    colors={["#79BA7E", "#AFCA85"]}
                    style={{ padding: 1, borderRadius: 24 }}
                  >
                    <View style={styles.recordButtonStop}>
                      <WithLocalSvg asset={Pause} style={styles.recordIcon} />
                      <Text style={styles.recordButtonTextStop}>
                        {"녹음정지"}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <LinearGradient
                  colors={["#79BA7E", "#AFCA85"]}
                  style={styles.recordButtonStart}
                >
                  <TouchableOpacity
                    onPress={startRecording}
                    style={{
                      ...styles.recordButtonStart,
                      backgroundColor: "transparent",
                    }}
                  >
                    <WithLocalSvg asset={Mic} style={styles.recordIcon} />
                    <Text style={styles.recordButtonTextStart}>
                      {"녹음시작"}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
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
    marginBottom: 4,
    marginHorizontal: 24,
  },
  descriptionText: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Pretendard-Bold",
    color: theme.grey800,
  },
  modeSwitcher: {
    width: 138,
    height: 40,
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
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Regular",
    color: theme.grey300,
    marginLeft: 24,
  },
  timerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 90,
  },
  timer: {
    color: "#333333",
    fontSize: 36,
    fontFamily: "Pretendard-Medium",
    marginRight: 32,
  },
  timerRecording: {
    color: "#000000",
  },
  timerInitial: {
    color: "#8B8B8B",
    marginRight: 0,
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
    marginRight: 17,
  }),
  waveformContainer: {
    height: 120,
    alignItems: "center",
  },
  waveformImage: {
    width: "60%",
    resizeMode: "contain",
  },
  buttonContainer: {
    alignItems: "center",
    paddingTop: 36,
  },
  recordButtonStart: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    paddingVertical: 13,
    width: 154,
    height: 48,
  },
  recordButtonStop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: 154,
    height: 48,
  },
  recordButtonTextStart: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    marginTop: -1, // 이유는 모르겠는데 수평이 안맞아서 추가
  },
  recordButtonTextStop: {
    color: "#79BA7E",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    marginTop: -1, // 이유는 모르겠는데 수평이 안맞아서 추가
  },
  recordIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  completeButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: theme.green500,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 32,
    marginTop: 12,
    width: 147,
    height: 48,
  },
  completeButtonText: {
    color: theme.green500,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    marginLeft: 8,
  },
});

export default VoiceRecordScreen;
