import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const VoiceRecordScreen = () => {
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState('');
  const recordingRef = useRef(null);

  const startRecording = async () => {
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
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording..');
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      console.log('Recording stopped and stored at', uri);

      const info = await FileSystem.getInfoAsync(uri);
      console.log('Recording file info:', info);

      if (info.size > 0) {
        sendToNaverSTT(uri);
      } else {
        console.error('Recording file is empty');
      }
      setRecording(null);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const sendToNaverSTT = async (fileUri) => {
    try {
      // 바이너리 파일 읽기
      const fileData = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('File Data Length:', fileData.length);
      console.log('File Data:', fileData.substring(0, 100)); // 전송 데이터의 일부를 로그로 출력

      const url = 'https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor';
      const config = {
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-NCP-APIGW-API-KEY-ID': 'tnu2l7l5pe', // 네이버 클라우드 API 키
          'X-NCP-APIGW-API-KEY': 'Ng7ni9swMdivuktz74C8lAH4NxkP02XW1X9typnt', // 네이버 클라우드 API 시크릿
        },
      };
      const response = await axios.post(url, fileData, config);
      console.log('Response from Naver STT:', response.data);
      setTranscript(response.data.text);
    } catch (err) {
      console.error('Failed to send to Naver STT', err);
      if (err.response) {
        console.log('Response data:', err.response.data);
        console.log('Response status:', err.response.status);
        console.log('Response headers:', err.response.headers);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {transcript ? <Text style={styles.transcript}>{transcript}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  transcript: {
    marginTop: 20,
    fontSize: 16,
    color: 'black',
  },
});

export default VoiceRecordScreen;



// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import Header from "../component/Header";
// import { theme } from "../colors/color";

// const VoiceRecordScreen = ({ navigation }) => {
//   const [isSchoolSelected, setIsSchoolSelected] = useState(true);
//   const [recording, setRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState("0:00");

//   const toggleCategory = () => {
//     setIsSchoolSelected(!isSchoolSelected);
//   };

//   const startRecording = () => {
//     // 녹음 시작 로직
//     setRecording(true);
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "white" }}>
//       <Header
//         left="leftArrow"
//         title="음성기록"
//         onLeftPress={() => navigation.popToTop()}
//         line={true}
//       />
//       <View style={styles.container}>
//         <Text style={styles.headerText}>음성기록</Text>
//         <View style={styles.categoryContainer}>
//           <TouchableOpacity
//             style={[
//               styles.categoryButton,
//               isSchoolSelected && styles.categoryButtonSelected,
//             ]}
//             onPress={toggleCategory}
//           >
//             <Text
//               style={
//                 isSchoolSelected
//                   ? styles.categoryTextSelected
//                   : styles.categoryText
//               }
//             >
//               학교
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.categoryButton,
//               !isSchoolSelected && styles.categoryButtonSelected,
//             ]}
//             onPress={toggleCategory}
//           >
//             <Text
//               style={
//                 !isSchoolSelected
//                   ? styles.categoryTextSelected
//                   : styles.categoryText
//               }
//             >
//               병원
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.infoText}>
//           우리 아이의 학교 관련 기록을 음성으로 기록해요!
//         </Text>
//         <Text style={styles.infoSubText}>
//           음성을 텍스트로 변환 기록되고 기록된 내용은 상세 기록에 자동으로
//           추가돼요
//         </Text>
//         <Text style={styles.recordingPrompt}>
//           녹음 버튼을 눌러서 기록을 시작하세요!
//         </Text>
//         <Text style={styles.recordingTime}>{recordingTime}</Text>
//         <View style={styles.recordingIcons}>
//           <Text>🔊</Text>
//           <Text>➡️</Text>
//           <Text>📄</Text>
//         </View>
//         <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
//           <Text style={styles.recordButtonText}>녹음 시작</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={{ flexDirection: "row" }}>
//         <View style={styles.progressLeft} />
//         <View style={styles.progressRight} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//     alignItems: "center",
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   categoryContainer: {
//     flexDirection: "row",
//     marginBottom: 16,
//   },
//   categoryButton: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#eee",
//     alignItems: "center",
//     borderRadius: 20,
//   },
//   categoryButtonSelected: {
//     backgroundColor: "#000",
//   },
//   categoryText: {
//     color: "#000",
//   },
//   categoryTextSelected: {
//     color: "#fff",
//   },
//   infoText: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   infoSubText: {
//     fontSize: 14,
//     textAlign: "center",
//     color: "#666",
//     marginBottom: 16,
//   },
//   recordingPrompt: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   recordingTime: {
//     fontSize: 32,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   recordingIcons: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "60%",
//     marginBottom: 16,
//   },
//   recordButton: {
//     backgroundColor: "#aaa",
//     padding: 10,
//     borderRadius: 20,
//   },
//   recordButtonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   progressLeft: {
//     width: "50%",
//     height: 4,
//     backgroundColor: theme.green500,
//   },
//   progressRight: {
//     width: "50%",
//     height: 4,
//     backgroundColor: theme.grey150,
//   },
// });

// export default VoiceRecordScreen;
