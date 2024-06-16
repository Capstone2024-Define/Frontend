
// import React, { useState, useRef } from 'react';
// import { View, Button, Text, StyleSheet } from 'react-native';
// import { Audio } from 'expo-av';
// import axios from 'axios';
// import * as FileSystem from 'expo-file-system';

// const VoiceRecordScreen = () => {
//   const [recording, setRecording] = useState(null);
//   const [transcript, setTranscript] = useState('');
//   const recordingRef = useRef(null);

//   const startRecording = async () => {
//     try {
//       await Audio.requestPermissionsAsync();
      
//       // 오디오 모드 설정
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//       );
//       recordingRef.current = recording;
//       setRecording(recording);
//       console.log('Recording started');
//     } catch (err) {
//       console.error('Failed to start recording', err);
//     }
//   };

//   const stopRecording = async () => {
//     try {
//       console.log('Stopping recording..');
//       await recordingRef.current.stopAndUnloadAsync();
//       const uri = recordingRef.current.getURI();
//       console.log('Recording stopped and stored at', uri);

//       const info = await FileSystem.getInfoAsync(uri);
//       console.log('Recording file info:', info);

//       if (info.size > 0) {
//         sendToNaverSTT(uri);
//       } else {
//         console.error('Recording file is empty');
//       }
//       setRecording(null);
//     } catch (error) {
//       console.error('Failed to stop recording', error);
//     }
//   };

//   const sendToNaverSTT = async (fileUri) => {
//     try {
//       const fileData = await FileSystem.readAsStringAsync(fileUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       // Base64 데이터를 ArrayBuffer로 변환
//       const binaryData = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));

//       const url = 'https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor';
//       const headers = {
//         'Content-Type': 'application/octet-stream',
//         'X-NCP-APIGW-API-KEY-ID': 'tnu2l7l5pe', // 네이버 클라우드 API 키
//         'X-NCP-APIGW-API-KEY': 'Ng7ni9swMdivuktz74C8lAH4NxkP02XW1X9typnt', // 네이버 클라우드 API 시크릿
//       };

//       const response = await axios.post(url, binaryData.buffer, {
//         headers: headers,
//         responseType: 'json',
//       });

//       console.log('Response from Naver STT:', response.data);
//       setTranscript(response.data.text);
//     } catch (err) {
//       console.error('Failed to send to Naver STT', err);
//       if (err.response) {
//         console.log('Response data:', err.response.data);
//         console.log('Response status:', err.response.status);
//         console.log('Response headers:', err.response.headers);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button
//         title={recording ? 'Stop Recording' : 'Start Recording'}
//         onPress={recording ? stopRecording : startRecording}
//       />
//       {transcript ? <Text style={styles.transcript}>{transcript}</Text> : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   transcript: {
//     marginTop: 20,
//     fontSize: 16,
//     color: 'black',
//   },
// });

// export default VoiceRecordScreen;





// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Pressable,
//   Modal,
//   Dimensions,
//   ImageBackground,
//   ScrollView,
//   StatusBar,
// } from "react-native";
// import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";
// import { Calendar } from "react-native-calendars";
// import HomeDayButton from "../component/HomeDayButton";
// import HomeVoiceButton from "../component/HomeVoiceButton";
// import { theme } from "../colors/color";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "@react-navigation/native";
// import { WithLocalSvg } from "react-native-svg/css";
// import Rabbit from "../assets/homeRabbit.svg";
// import Edit from "../assets/edit.svg";
// import Mic from "../assets/mic.svg";
// import Left from "../assets/chevron_left.svg";
// import Right from "../assets/chevron_right.svg";
// import Calender from "../assets/calendar.svg";
// import NoRecord from "../assets/norecord.svg";

// // 화면 크기 가져오기
// const SCREEN_HEIGHT = Dimensions.get("window").height;

// // 캘린더 모달창
// const CalendarModal = ({ visible, onClose, selectedDate, setSelectedDate }) => {
//   return (
//     <Modal transparent={true} visible={visible} onRequestClose={onClose}>
//       <Pressable style={styles.modalBackground} onPress={onClose}>
//         <Pressable style={styles.modal}>
//           <Calendar
//             initialDate={selectedDate}
//             monthFormat={"yyyy년 MM월"}
//             onDayPress={(day) => {
//               setSelectedDate(day.dateString);
//               onClose();
//             }}
//             markedDates={{
//               [selectedDate]: {
//                 selected: true,
//                 selectedColor: theme.green500,
//               },
//             }}
//           />
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// // 홈 스크린
// export default function HomeScreen({ navigation }) {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [weeks, setWeeks] = useState([]);
//   const [moods, setMoods] = useState({});
//   const [images, setImages] = useState([]);
//   const [text, setText] = useState("");
//   const [emoji, setEmoji] = useState([]);

//   useEffect(() => {
//     const date = cvtDateString(new Date());
//     setSelectedDate(date);
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       if (selectedDate) {
//         getWeeks(selectedDate);

//         // 기록 로드
//         async function load() {
//           try {
//             const rawRecord = await AsyncStorage.getItem(selectedDate);
//             const newRecord = JSON.parse(rawRecord);

//             let newTotalText = "";
//             if (newRecord.home) {
//               newTotalText += newRecord.home;
//             }
//             if (newRecord.school) {
//               newTotalText += ` ${newRecord.school}`;
//             }
//             if (newRecord.hospital) {
//               newTotalText += ` ${newRecord.hospital}`;
//             }
//             setText(newTotalText);
//             setImages(newRecord.image);

//             //console.log(newRecord);
//           } catch (e) {
//             console.log("기록 로드 에러");
//           }
//         }
//         load();
//       }
//     }, [selectedDate])
//   );

//   useEffect(() => {
//     const fetchEmojiColors = async () => {
//       const newEmoji = [];
//       for (let i = 0; i < weeks.length; i++) {
//         try {
//           const color = await getEmojiColor(weeks[i]);
//           newEmoji.push(color);
//         } catch (error) {
//           console.error("fetchEmojiColors 에러", error);
//         }
//       }
//       //console.log(newEmoji);
//       setEmoji(newEmoji);
//     };

//     fetchEmojiColors();
//   }, [weeks]);

//   const cvtDateString = (date) => {
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const getWeeks = (date) => {
//     const startDate = new Date(date);
//     const dayOfWeek = startDate.getDay();
//     startDate.setDate(startDate.getDate() - dayOfWeek);

//     const newWeeks = [];
//     for (let i = 0; i < 7; i++) {
//       const tempDate = new Date(startDate);
//       tempDate.setDate(startDate.getDate() + i);
//       newWeeks.push(cvtDateString(tempDate));
//     }
//     setWeeks(newWeeks);
//   };

//   const getWeekNumber = (date) => {
//     const dateFrom = new Date(date);
//     const currentDate = dateFrom.getDate();
//     const startOfMonth = new Date(dateFrom.setDate(1));
//     const weekDay = startOfMonth.getDay();

//     return parseInt((weekDay - 1 + currentDate) / 7) + 1;
//   };

//   const renderEmoji = (emoji, index) => (
//     <TouchableOpacity
//       key={index}
//       onPress={() => setMoods({ ...moods, [selectedDate]: emoji })}
//     >
//       <Text
//         style={[
//           styles.emoji,
//           moods[selectedDate] === emoji ? styles.selectedEmoji : null,
//         ]}
//       >
//         {emoji}
//       </Text>
//     </TouchableOpacity>
//   );

//   const fetchData = async () => {
//     // 서버에서 데이터를 받아오는 로직 예시
//     const data = {
//       "2024-06-09": "green",
//     };
//     setMoods(data);
//   };

//   const handleWeekChange = (direction) => {
//     const current = new Date(selectedDate);
//     const newDate = new Date(
//       current.setDate(current.getDate() + direction * 7)
//     );
//     setSelectedDate(cvtDateString(newDate));
//   };

//   // 현재 날짜와 선택한 날짜가 같은지 확인하는 함수
//   const isToday = (date) => {
//     const today = new Date();
//     const compareDate = new Date(date);
//     return (
//       today.getFullYear() === compareDate.getFullYear() &&
//       today.getMonth() === compareDate.getMonth() &&
//       today.getDate() === compareDate.getDate()
//     );
//   };

//   // const getMoodColor = (date) => {
//   //   return moods[date] || "#D3D3D3";
//   // };

//   const isPastDate = (date) => {
//     const today = new Date();
//     const compareDate = new Date(date);
//     return today < compareDate;
//   };

//   // 이모지 색 컬러
//   const getEmojiColor = async (date) => {
//     let emojiColor = theme.grey50;

//     try {
//       const rawRecord = await AsyncStorage.getItem(date);
//       if (rawRecord !== null) {
//         const record = JSON.parse(rawRecord);
//         if (record.checkList) {
//           const selectedCount = record.checkList.length;
//           if (selectedCount <= 3) {
//             emojiColor = theme.pink;
//           } else if (selectedCount <= 9) {
//             emojiColor = theme.yellow;
//           } else {
//             emojiColor = theme.green;
//           }
//         }
//       }

//       return emojiColor;
//     } catch (error) {
//       console.log("getEmojiColor 에러", error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ImageBackground
//         source={require("../assets/background.png")}
//         style={styles.backgroundImage}
//       >
//         <View style={{ flex: 1 }}>
//           <View
//             style={{
//               flexDirection: "row",
//               marginTop: 17,
//               marginLeft: 29,
//               marginRight: 16,
//               justifyContent: "space-between",
//             }}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "flex-end",
//                 marginBottom: 18,
//               }}
//             >
//               <Text style={styles.title}>{"오늘도 같이 기록해볼까요?"}</Text>
//               <View style={{ flexDirection: "row", alignItems: "baseline" }}>
//                 <Text style={styles.boldTitle}>12일째 </Text>
//                 <Text style={styles.title}>기록하는 중</Text>
//               </View>
//             </View>
//             <WithLocalSvg asset={Rabbit} />
//           </View>
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: "#FEFCF4",
//               borderTopLeftRadius: 24,
//               borderTopRightRadius: 24,
//               paddingTop: 24,
//               paddingBottom: 14,
//               paddingHorizontal: 24,
//               alignItems: "center", // 네모 박스들을 중앙 정렬
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginBottom: 16,
//               }}
//             >
//               <TouchableOpacity
//                 activeOpacity={0.5}
//                 onPress={() => setModalVisible(true)}
//               >
//                 <WithLocalSvg asset={Calender} />
//               </TouchableOpacity>
//               <Text
//                 style={{
//                   color: "#555555",
//                   fontSize: 14,
//                   marginLeft: 8,
//                   fontFamily: "Pretendard-Medium",
//                 }}
//               >
//                 {`${new Date(selectedDate).getFullYear()}년 ${
//                   new Date(selectedDate).getMonth() + 1
//                 }월 ${getWeekNumber(selectedDate)}주차`}
//               </Text>
//               <View style={{ flex: 1, alignSelf: "stretch" }}></View>
//               <TouchableOpacity onPress={() => handleWeekChange(-1)}>
//                 <WithLocalSvg asset={Left} style={{ marginRight: 10 }} />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleWeekChange(1)}>
//                 <WithLocalSvg asset={Right} />
//               </TouchableOpacity>
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 backgroundColor: "#FFFFFF",
//                 borderRadius: 16,
//                 paddingVertical: 8,
//                 marginBottom: 16,
//                 width: "100%", // 부모 뷰의 전체 너비를 사용
//                 maxWidth: 350, // 최대 너비 설정
//                 paddingHorizontal: 16, // 내부 패딩
//               }}
//             >
//               {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={{
//                     flex: 1,
//                     alignItems: "center",
//                     paddingVertical: 9,
//                     paddingHorizontal: 4,
//                     backgroundColor:
//                       selectedDate === weeks[index]
//                         ? theme.green500
//                         : "transparent",
//                     borderRadius: selectedDate === weeks[index] ? 24 : 0,
//                   }}
//                   onPress={() => setSelectedDate(weeks[index])}
//                 >
//                   <Text
//                     style={{
//                       color:
//                         selectedDate === weeks[index] ? "#FFFFFF" : "#242424",
//                       fontSize: 12,
//                       marginBottom: 7,
//                       textAlign: "center",
//                       fontFamily:
//                         selectedDate === weeks[index]
//                           ? "Pretendard-Bold"
//                           : "Pretendard-Regular",
//                     }}
//                   >
//                     {day}
//                   </Text>
//                   <Text
//                     style={{
//                       color:
//                         selectedDate === weeks[index]
//                           ? "#FFFFFF"
//                           : isPastDate(weeks[index])
//                           ? "#A9A9A9"
//                           : "#242424",
//                       fontSize: 12,
//                       marginBottom: 7,
//                       textAlign: "center",
//                       fontFamily:
//                         selectedDate === weeks[index]
//                           ? "Pretendard-Bold"
//                           : "Pretendard-Regular",
//                     }}
//                   >
//                     {new Date(weeks[index]).getDate()}
//                   </Text>
//                   <FontAwesome name="circle" size={20} color={emoji[index]} />
//                   {/* <View
//                     style={{
//                       width: 10,
//                       height: 10,
//                       borderRadius: 5,
//                       backgroundColor: getMoodColor(weeks[index]),
//                       marginTop: 4,
//                     }}
//                   /> */}
//                 </TouchableOpacity>
//               ))}
//             </View>
//             {images.length > 0 || text ? (
//               <View style={{ flex: 1 }}>
//                 <TouchableOpacity
//                   style={styles.recordContainer}
//                   activeOpacity={0.5}
//                   onPress={() =>
//                     navigation.push("DetailHistory", { date: selectedDate })
//                   }
//                 >
//                   <View style={styles.recordHeader}>
//                     <Text style={styles.recordTitle}>
//                       {`${new Date(selectedDate).getMonth() + 1}.${new Date(
//                         selectedDate
//                       ).getDate()} ${
//                         ["일", "월", "화", "수", "목", "금", "토"][
//                           new Date(selectedDate).getDay()
//                         ]
//                       }요일${isToday(selectedDate) ? " (오늘)" : ""}`}
//                     </Text>
//                     <Text style={styles.dubogi}>더보기</Text>
//                   </View>
//                   <View style={styles.line} />
//                   <View style={{ flexDirection: "row", marginBottom: 10 }}>
//                     {images.map((image) => (
//                       <View key={image.id}>
//                         <Image
//                           source={{ uri: image.uri }}
//                           style={styles.photo}
//                           resizeMode="cover"
//                         />
//                       </View>
//                     ))}
//                   </View>
//                   <Text style={styles.recordText}>
//                     {text.slice(0, 92).replace(/\n/g, " ")}...
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={{ flex: 1 }}>
//                 <View
//                   style={{
//                     width: 312,
//                     height: 188,
//                     backgroundColor: "#FBFBFB",
//                     borderRadius: 8,
//                     paddingVertical: 12,
//                     paddingHorizontal: 16,
//                     marginBottom: 36,
//                     alignItems: "center", // 네모 박스들을 중앙 정렬
//                   }}
//                 >
//                   <Text
//                     style={{
//                       color: "#333333",
//                       fontSize: 14,
//                       marginBottom: 4,
//                       fontFamily: "Pretendard-Medium",
//                       textAlign: "left", // 왼쪽 정렬
//                       alignSelf: "flex-start", // 텍스트를 부모 뷰의 왼쪽에 정렬
//                     }}
//                   >
//                     {`${new Date(selectedDate).getMonth() + 1}.${new Date(
//                       selectedDate
//                     ).getDate()} ${
//                       ["일", "월", "화", "수", "목", "금", "토"][
//                         new Date(selectedDate).getDay()
//                       ]
//                     }요일${isToday(selectedDate) ? " (오늘)" : ""}`}
//                   </Text>

//                   <View
//                     style={{
//                       flex: 1,
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <WithLocalSvg asset={NoRecord} />
//                     <Text
//                       style={{
//                         color: "#6F6F6F",
//                         fontSize: 14,
//                         marginTop: 10,
//                         alignItems: "center",
//                         fontFamily: "Human-beomseok",
//                       }}
//                     >
//                       {"아직 기록하지 않았어요!"}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             )}
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 width: "100%",
//                 maxWidth: 350,
//               }}
//             >
//               <TouchableOpacity
//                 style={styles.greenButton}
//                 onPress={() =>
//                   navigation.push("SymptomCheck", { date: selectedDate })
//                 }
//               >
//                 <WithLocalSvg asset={Edit} />
//                 <Text
//                   style={{
//                     color: "#FFFFFF",
//                     fontSize: 14,
//                     marginLeft: 8,
//                     fontFamily: "Pretendard-Medium",
//                   }}
//                 >
//                   {"하루기록"}
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.yellowButton}
//                 onPress={() => navigation.push("MainVoice")}
//               >
//                 <WithLocalSvg asset={Mic} />
//                 <Text
//                   style={{
//                     color: "#FFFFFF",
//                     fontSize: 14,
//                     marginLeft: 8,
//                     fontFamily: "Pretendard-Medium",
//                   }}
//                 >
//                   {"음성기록"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ImageBackground>
//       <CalendarModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         selectedDate={selectedDate}
//         setSelectedDate={setSelectedDate}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: "cover",
//   },
//   title: {
//     marginBottom: 5,
//     fontSize: 16,
//     fontFamily: "Pretendard-Regular",
//     color: "white",
//   },
//   boldTitle: {
//     fontSize: 18,
//     fontFamily: "Pretendard-Medium",
//     color: "white",
//   },
//   header: {
//     backgroundColor: "#DFF0D8",
//     borderRadius: 20,
//     padding: 20,
//     alignItems: "center",
//   },
//   headerText: {
//     fontSize: 18,
//     color: "#333",
//   },
//   subHeaderText: {
//     fontSize: 16,
//     color: "#555",
//   },
//   rabbitImage: {
//     width: 50,
//     height: 50,
//     marginTop: 10,
//   },
//   calendar: {
//     marginTop: 20,
//     padding: 20,
//     borderRadius: 20,
//     backgroundColor: "#F7F7F7",
//   },
//   calendarHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   calendarTitle: {
//     fontSize: 16,
//   },
//   weekDays: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dayContainer: {
//     alignItems: "center",
//   },
//   dayText: {
//     fontSize: 14,
//     color: "#888",
//   },
//   dayCircle: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "#F0F0F0",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 5,
//   },
//   selectedDay: {
//     backgroundColor: "#66BB6A",
//   },
//   dateText: {
//     color: "#333",
//   },
//   recordContainer: {
//     width: 312,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginBottom: 16,
//     borderRadius: 8,
//     backgroundColor: "white",
//   },
//   recordHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   recordTitle: {
//     fontSize: 14,
//     fontFamily: "Pretendard-Medium",
//     color: theme.grey700,
//   },
//   dubogi: {
//     fontSize: 12,
//     fontFamily: "Pretendard-Bold",
//     color: theme.grey400,
//   },
//   line: {
//     height: 1,
//     marginBottom: 10,
//     backgroundColor: theme.grey250,
//   },
//   recordText: {
//     fontSize: 14,
//     fontFamily: "Human-beomseok",
//     color: theme.grey800,
//   },
//   photo: {
//     width: 75,
//     height: 75,
//     marginRight: 12,
//     borderRadius: 8,
//   },
//   noRecord: {
//     alignItems: "center",
//   },
//   noRecordImage: {
//     width: 40,
//     height: 40,
//   },
//   noRecordText: {
//     fontSize: 14,
//     color: "#888",
//     marginTop: 5,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   greenButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: theme.green500,
//     borderRadius: 24,
//     width: 177,
//     height: 44,
//     justifyContent: "center",
//     marginRight: 16,
//   },
//   yellowButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F5DE8F",
//     borderRadius: 24,
//     width: 119,
//     height: 44,
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "white",
//     marginLeft: 5,
//   },
//   buttonIcon: {
//     width: 24,
//     height: 24,
//     marginLeft: 8,
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//   },
//   modal: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 15,
//     alignItems: "center",
//   },
// });


// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
// import Header from "../component/Header";
// import { theme } from "../colors/color";

// const VoiceRecordScreen = ({ navigation, route }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [intervalId, setIntervalId] = useState(null);
//   const [mode, setMode] = useState('school');

//   useEffect(() => {
//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [intervalId]);

//   const startRecording = () => {
//     setIsRecording(true);
//     const id = setInterval(() => {
//       setRecordingTime((prev) => prev + 1);
//     }, 1000);
//     setIntervalId(id);
//   };

//   const stopRecording = () => {
//     setIsRecording(false);
//     clearInterval(intervalId);
//     setIntervalId(null);
//     setRecordingTime(0);
//   };

//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "white" }}>
//       <Header
//         left="leftArrow"
//         title="음성기록"
//         right="다음"
//         onLeftPress={() => {
//           navigation.popToTop();
//         }}
//         onRightPress={() =>
//           navigation.push("SymptomResult", {
//             // selectedCount: selectedChecklistItems.length,
//             date: route.params.date,
//           })
//         }
//         line={false}
//       />
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.descriptionContainer}>
//           <Text style={styles.descriptionText}>{"음성을 녹음하면\n텍스트로 변환해요"}</Text>
//           <View style={styles.modeSwitcher}>
//             <TouchableOpacity onPress={() => setMode('school')} style={mode === 'school' ? styles.activeMode : styles.inactiveMode}>
//               <Text style={mode === 'school' ? styles.activeModeText : styles.inactiveModeText}>{"학교"}</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => setMode('hospital')} style={mode === 'hospital' ? styles.activeMode : styles.inactiveMode}>
//               <Text style={mode === 'hospital' ? styles.activeModeText : styles.inactiveModeText}>{"병원"}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <Text style={styles.recordingHint}>{"녹음을 하면 글로 기록이 되고\n기록된 내용은 상세기록에 추가돼요"}</Text>
//         <View style={styles.timerContainer}>
//           {isRecording && <Image source={require('../assets/recordgreen.png')} style={styles.timerIcon} />}
//           <Text style={[styles.timer, isRecording && styles.timerRecording]}>{formatTime(recordingTime)}</Text>
//         </View>
//         <View style={styles.waveformContainer}>
//           {isRecording ? (
//             <>
//               <Image source={require('../assets/wave.png')} style={styles.waveformImage} />
//             </>
//           ) : (
//             <View style={styles.waveformLine} />
//           )}
//         </View>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={isRecording ? styles.recordButtonStop : styles.recordButtonStart}>
//             <Image source={isRecording ? require('../assets/pause.png') : require('../assets/graphic_eq.png')} style={styles.recordIcon} />
//             <Text style={isRecording ? styles.recordButtonTextStop : styles.recordButtonTextStart}>{isRecording ? "녹음정지" : "녹음시작"}</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//       <View style={{ flexDirection: "row" }}>
//         <View style={styles.progressLeft} />
//         <View style={styles.progressRight} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     marginTop: 30,
//   },
//   descriptionContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//     marginHorizontal: 24,
//   },
//   descriptionText: {
//     color: "#242424",
//     fontSize: 18,
//     width: 127,
//   },
//   modeSwitcher: {
//     width: 138,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#F6F6F6",
//     borderRadius: 24,
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//   },
//   activeMode: {
//     width: 63,
//     alignItems: "center",
//     backgroundColor: "#78BA7D",
//     borderRadius: 30,
//     paddingVertical: 9,
//   },
//   inactiveMode: {
//     width: 63,
//     alignItems: "center",
//     backgroundColor: "#F6F6F6",
//     borderRadius: 30,
//     paddingVertical: 9,
//   },
//   activeModeText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//   },
//   inactiveModeText: {
//     color: "#A5A5A5",
//     fontSize: 14,
//   },
//   recordingHint: {
//     color: "#A5A5A5",
//     fontSize: 12,
//     marginBottom: 20,
//     marginHorizontal: 24,
//     width: 312,
//   },
//   timerContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 100,
//   },
//   timer: {
//     color: "#8B8B8B",
//     fontSize: 36,
//     fontFamily: "Pretendard-Bold",
//     marginBottom: 30,
//   },
//   timerRecording: {
//     color: "#000000",
//     marginLeft: 8,
//   },
//   timerIcon: {
//     width: 15,
//     height: 15,
//     marginRight: 8,
//     marginBottom:30,
//   },
//   waveformContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   waveformLine: {
//     width: '100%',
//     height: 1,
//     backgroundColor: '#78BA7D',
//     marginTop: 30,
//     marginBottom: 100,
//   },
//   waveformImage: {
//     width: '100%',
//     resizeMode: 'contain',
//     marginBottom: 100,
//   },
//   buttonContainer: {
//     alignItems: 'center',
//     marginBottom: 93,
//   },
//   recordButtonStart: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#78BA7D",
//     borderRadius: 24,
//     paddingVertical: 13,
//     width: 147,
//     height: 44,
//   },
//   recordButtonStop: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#79BA7E",
//     borderRadius: 24,
//     paddingVertical: 13,
//     width: 147,
//     height: 44,
//   },
//   recordButtonTextStart: {
//     color: "#FFFFFF",
//     fontSize: 14,
//   },
//   recordButtonTextStop: {
//     color: "#79BA7E",
//     fontSize: 14,
//   },
//   recordIcon: {
//     width: 18,
//     height: 18,
//     marginRight: 8,
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
