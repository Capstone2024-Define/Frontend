import React, { useState, useRef } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import * as FileSystem from "expo-file-system";

const VoiceTestScreen = () => {
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState("");
  const recordingRef = useRef(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access microphone was denied");
        return;
      }

      // 오디오 모드 설정
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      recordingRef.current = recording;
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    try {
      console.log("Stopping recording..");
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      console.log("Recording stopped and stored at", uri);

      const info = await FileSystem.getInfoAsync(uri);
      console.log("Recording file info:", info);

      if (info.size > 0) {
        sendToNaverSTT(uri);
      } else {
        console.error("Recording file is empty");
      }
      setRecording(null);
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  // uri를 통해 재생을 하고싶다면 사용
  const playAudio = async () => {
    const uri = recordingRef.current.getURI();
    const sound = new Audio.Sound();
    await sound.loadAsync({ uri: uri });
    console.log("Playing Sound");
    await sound.replayAsync();
  };

  const sendToNaverSTT = async (fileUri) => {
    try {
      // 바이너리 파일 읽기
      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("File Data Length:", fileData.length);
      console.log("File Data:", fileData.substring(0, 100)); // 전송 데이터의 일부를 로그로 출력

      const url = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor";
      const config = {
        headers: {
          "Content-Type": "application/octet-stream",
          "X-NCP-APIGW-API-KEY-ID": "tnu2l7l5pe", // 네이버 클라우드 API 키
          "X-NCP-APIGW-API-KEY": "Ng7ni9swMdivuktz74C8lAH4NxkP02XW1X9typnt", // 네이버 클라우드 API 시크릿
        },
      };
      const response = await axios.post(url, fileData, config);
      console.log("Response from Naver STT:", response.data);
      setTranscript(response.data.text);
    } catch (err) {
      console.error("Failed to send to Naver STT", err);
      if (err.response) {
        console.log("Response data:", err.response.data);
        console.log("Response status:", err.response.status);
        console.log("Response headers:", err.response.headers);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
      <Button title="녹음 다시듣기" onPress={playAudio} />
      {transcript ? <Text style={styles.transcript}>{transcript}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  transcript: {
    marginTop: 20,
    fontSize: 16,
    color: "black",
  },
});

export default VoiceTestScreen;
