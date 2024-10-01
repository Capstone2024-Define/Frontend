import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  ImageBackground,
  StatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { theme } from "../colors/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { WithLocalSvg } from "react-native-svg/css";
import Rabbit from "../assets/homeRabbit.svg";
import Edit_white from "../assets/edit_white.svg";
import Note_white from "../assets/notes_white.svg";
import Mic from "../assets/mic_green.svg";
import Left from "../assets/chevron_left.svg";
import Right from "../assets/chevron_right.svg";
import Calender from "../assets/calendarNew.svg";
import NoRecord from "../assets/norecord.svg";
import { Shadow } from "react-native-shadow-2"; // 그림자 라이브러리
import { LinearGradient } from "expo-linear-gradient"; // 그라데이션 라이브러리
import axios from "axios";

// 캘린더 모달창
const CalendarModal = ({ visible, onClose, selectedDate, setSelectedDate }) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalBackground} onPress={onClose}>
        <Pressable style={styles.modal}>
          <Calendar
            initialDate={selectedDate}
            monthFormat={"yyyy년 MM월"}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              onClose();
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: theme.green500,
              },
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// 홈 스크린
export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [weeks, setWeeks] = useState([]);
  const [images, setImages] = useState([]);
  const [totalText, setTotalText] = useState("");
  const [emoji, setEmoji] = useState([]);
  const [summaryText, setSummaryText] = useState("");
  let user_id = 7274; // 유저 id

  // 홈 화면만 상태바 색 변경
  // ios에는 적용안됨 수정함 하기
  // useFocusEffect(
  //   React.useCallback(() => {
  //     StatusBar.setBarStyle("light-content");
  //     StatusBar.setBackgroundColor(theme.green500);

  //     return () => {
  //       // 홈 화면을 벗어날 때 StatusBar 초기화
  //       StatusBar.setBarStyle("dark-content");
  //       StatusBar.setBackgroundColor("#fff");
  //     };
  //   }, [])
  // );

  // 시작 시 오늘 날짜를 선택날짜로 함
  useEffect(() => {
    const date = cvtDateString(new Date());
    setSelectedDate(date);
  }, []);

  // 선택날짜 기록 로드(DB)
  useFocusEffect(
    useCallback(() => {
      if (selectedDate) {
        getWeeks(selectedDate);

        // 기록 로드
        const load = async () => {
          try {
            // const rawRecord = await AsyncStorage.getItem(selectedDate);
            // const newRecord = JSON.parse(rawRecord);

            // let newTotalText = "";
            // if (newRecord.home) {
            //   newTotalText += newRecord.home;
            // }
            // if (newRecord.school) {
            //   newTotalText += ` ${newRecord.school}`;
            // }
            // if (newRecord.hospital) {
            //   newTotalText += ` ${newRecord.hospital}`;
            // }
            // setTotalText(newTotalText);
            // setImages(newRecord.image);
            // setSummaryText(newRecord.summaryText);

            //console.log(newRecord);

            // user_id 가져오기
            // try {
            //   const value = await AsyncStorage.getItem("user_id");
            //   if (value !== null) {
            //     user_id = value;
            //   } else {
            //     console.log("user_id가 null입니다.");
            //   }
            // } catch (error) {
            //   console.log("유저id 불러오기 실패");
            // }

            // 요약, 상태 가져옴
            const response = await axios.get(
              `http://192.168.123.159:8080/daily/records/${user_id}/${selectedDate}`
            );

            console.log("GET: ", response.data);
            setTotalText(response.data.summary);
            setSummaryText(response.data.summary);
          } catch (e) {
            // 기록 없는거니까 텍스트랑 이미지 비움
            setTotalText("");
            setImages([]);
          }
        };
        load();
      }
    }, [selectedDate])
  );

  // 주(weeks)가 바뀌면 이모지 색 변경
  useFocusEffect(
    useCallback(() => {
      const fetchEmojiColors = async () => {
        const newEmoji = await Promise.all(
          weeks.map(async (week) => {
            try {
              return await getEmojiColor(week);
            } catch (error) {
              console.error("fetchEmojiColors 에러", error);
              return theme.grey150; // 에러 발생 시 기본 색상 반환
            }
          })
        );
        setEmoji(newEmoji);
      };

      fetchEmojiColors();
    }, [weeks])
  );

  // Date형 -> "YYYY-MM-DD" 문자형
  const cvtDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 선택된 날짜 주(weeks) 얻기
  const getWeeks = (date) => {
    const startDate = new Date(date);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const newWeeks = [];
    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(startDate);
      tempDate.setDate(startDate.getDate() + i);
      newWeeks.push(cvtDateString(tempDate));
    }
    setWeeks(newWeeks);
  };

  // 몇주차인지 얻기
  const getWeekNumber = (date) => {
    const dateFrom = new Date(date);
    const currentDate = dateFrom.getDate();
    const startOfMonth = new Date(dateFrom.setDate(1));
    const weekDay = startOfMonth.getDay();

    return parseInt((weekDay - 1 + currentDate) / 7) + 1;
  };

  // 주 변경 화살표 함수
  const handleWeekChange = (direction) => {
    const current = new Date(selectedDate);
    const newDate = new Date(
      current.setDate(current.getDate() + direction * 7)
    );
    setSelectedDate(cvtDateString(newDate));
  };

  // 현재 날짜와 선택한 날짜가 같은지 확인하는 함수
  const isToday = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return (
      today.getFullYear() === compareDate.getFullYear() &&
      today.getMonth() === compareDate.getMonth() &&
      today.getDate() === compareDate.getDate()
    );
  };

  const isPastDate = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return today < compareDate;
  };

  // 이모지 색 컬러
  const getEmojiColor = async (date) => {
    let emojiColor = theme.grey150;

    try {
      //const rawRecord = await AsyncStorage.getItem(date);
      // if (rawRecord !== null) {
      //   const record = JSON.parse(rawRecord);
      //   if (record.symptomList) {
      //     const selectedCount = record.symptomList.length;
      //     if (selectedCount <= 3) {
      //       emojiColor = theme.green;
      //     } else if (selectedCount <= 9) {
      //       emojiColor = theme.yellow;
      //     } else {
      //       emojiColor = theme.pink;
      //     }
      //   }
      // }

      const response = await axios.get(
        `http://192.168.123.159:8080/daily/records/${user_id}/${date}`
      );
      const dayState = response.data.state;

      switch (dayState) {
        case 2:
          emojiColor = theme.green;
          break;
        case 1:
          emojiColor = theme.yellow;
          break;
        case 0:
          emojiColor = theme.pink;
          break;
        default:
          emojiColor = theme.grey150;
      }
    } catch (error) {
      console.log("getEmojiColor 에러", error);
    }
    return emojiColor;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ImageBackground
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
      > */}
      <ImageBackground
        source={require("../assets/home_background.png")}
        style={styles.backgroundImage}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              marginTop: 17,
              marginLeft: 20,
              marginRight: 6,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                marginBottom: 12,
              }}
            >
              <Text style={styles.title}>{"오늘도 같이 기록해볼까요?"}</Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text style={styles.boldTitle}>12일째 </Text>
                <Text style={styles.title}>기록하는 중</Text>
              </View>
            </View>
            <WithLocalSvg asset={Rabbit} />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 16,
              paddingBottom: 14,
              paddingHorizontal: 20,
              alignItems: "center", // 네모 박스들을 중앙 정렬
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setModalVisible(true)}
              >
                <WithLocalSvg asset={Calender} />
              </TouchableOpacity>
              <Text
                style={{
                  color: theme.grey700,
                  fontSize: 14,
                  lineHeight: 20,
                  marginLeft: 8,
                  fontFamily: "Pretendard-Medium",
                }}
              >
                {`${new Date(selectedDate).getFullYear()}년 ${
                  new Date(selectedDate).getMonth() + 1
                }월 ${getWeekNumber(selectedDate)}주차`}
              </Text>
              <View style={{ flex: 1, alignSelf: "stretch" }}></View>
              <TouchableOpacity onPress={() => handleWeekChange(-1)}>
                <WithLocalSvg asset={Left} style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleWeekChange(1)}>
                <WithLocalSvg asset={Right} />
              </TouchableOpacity>
            </View>
            <Shadow distance={5} startColor="#00000010" endColor="#00000000">
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 8,
                  paddingVertical: 8,
                  width: 320, // 부모 뷰의 전체 너비를 사용
                  maxWidth: 350, // 최대 너비 설정
                  paddingHorizontal: 7, // 내부 패딩
                }}
              >
                {["일", "월", "화", "수", "목", "금", "토"].map(
                  (day, index) => {
                    const isDisabled = isPastDate(weeks[index]); // 현재 날짜 이후인지 확인
                    return (
                      <LinearGradient
                        key={index}
                        colors={
                          selectedDate === weeks[index]
                            ? ["#79BA7E", "#AFCA85"] // 선택된 날짜일 때 그라데이션 색상
                            : ["transparent", "transparent"] // 선택되지 않은 날짜일 때 투명
                        }
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingVertical: 5,
                          marginHorizontal: 2.5,
                          borderRadius: 24,
                        }}
                      >
                        <TouchableOpacity
                          key={index}
                          style={{
                            alignItems: "center",
                            backgroundColor: "transparent",
                          }}
                          onPress={() =>
                            !isDisabled && setSelectedDate(weeks[index])
                          } // 비활성화된 날짜는 터치 불가
                          disabled={isDisabled} // 비활성화된 날짜는 터치 불가
                        >
                          <Text
                            style={{
                              color:
                                selectedDate === weeks[index]
                                  ? "#FFFFFF"
                                  : "#242424",
                              fontSize: 12,
                              lineHeight: 20,
                              marginBottom: 4,
                              textAlign: "center",
                              fontFamily:
                                selectedDate === weeks[index]
                                  ? "Pretendard-Bold"
                                  : "Pretendard-Regular",
                            }}
                          >
                            {day}
                          </Text>
                          <Text
                            style={{
                              color:
                                selectedDate === weeks[index]
                                  ? "#FFFFFF"
                                  : isPastDate(weeks[index])
                                  ? theme.grey400
                                  : "#242424",
                              fontSize: 12,
                              marginBottom: 4,
                              textAlign: "center",
                              fontFamily:
                                selectedDate === weeks[index]
                                  ? "Pretendard-Bold"
                                  : "Pretendard-Regular",
                            }}
                          >
                            {new Date(weeks[index]).getDate()}
                          </Text>
                          <FontAwesome
                            name="circle"
                            size={25}
                            color={emoji[index] ? emoji[index] : theme.grey100}
                          />
                        </TouchableOpacity>
                      </LinearGradient>
                    );
                  }
                )}
              </View>
            </Shadow>
            <View style={{ marginBottom: 16 }} />

            {images.length > 0 || totalText ? (
              <View style={{ flex: 1 }}>
                <Shadow
                  distance={5}
                  startColor="#00000010"
                  endColor="#00000000"
                >
                  <TouchableOpacity
                    style={styles.recordContainer}
                    activeOpacity={0.5}
                    onPress={() =>
                      navigation.push("DetailHistory", {
                        date: selectedDate,
                        user_id: user_id,
                      })
                    }
                  >
                    <View style={styles.recordHeader}>
                      <Text style={styles.recordTitle}>
                        {`${new Date(selectedDate).getMonth() + 1}.${new Date(
                          selectedDate
                        ).getDate()} ${
                          ["일", "월", "화", "수", "목", "금", "토"][
                            new Date(selectedDate).getDay()
                          ]
                        }요일${isToday(selectedDate) ? " (오늘)" : ""}`}
                      </Text>
                      <Text style={styles.dubogi}>더보기</Text>
                    </View>
                    <View style={styles.line} />
                    <View style={{ flexDirection: "row", marginBottom: 10 }}>
                      {images.map((image) => (
                        <View key={image.id}>
                          <Image
                            source={{ uri: image.uri }}
                            style={styles.photo}
                            resizeMode="cover"
                          />
                        </View>
                      ))}
                    </View>
                    <Text style={styles.recordText}>
                      {summaryText && summaryText !== ""
                        ? summaryText.slice(0, 92).replace(/\n/g, " ")
                        : totalText.slice(0, 92).replace(/\n/g, " ")}
                      ...
                    </Text>
                  </TouchableOpacity>
                </Shadow>
                <View style={{ marginBottom: 16 }} />
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <Shadow
                  distance={5}
                  startColor="#00000010"
                  endColor="#00000000"
                >
                  <View
                    style={{
                      width: 320,
                      height: 188,
                      backgroundColor: "white",
                      borderRadius: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      marginBottom: 36,
                      alignItems: "center", // 네모 박스들을 중앙 정렬
                    }}
                  >
                    <Text
                      style={{
                        color: "#333333",
                        fontSize: 14,
                        marginBottom: 4,
                        fontFamily: "Pretendard-Medium",
                        textAlign: "left", // 왼쪽 정렬
                        alignSelf: "flex-start", // 텍스트를 부모 뷰의 왼쪽에 정렬
                      }}
                    >
                      {`${new Date(selectedDate).getMonth() + 1}.${new Date(
                        selectedDate
                      ).getDate()} ${
                        ["일", "월", "화", "수", "목", "금", "토"][
                          new Date(selectedDate).getDay()
                        ]
                      }요일${isToday(selectedDate) ? " (오늘)" : ""}`}
                    </Text>

                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <WithLocalSvg asset={NoRecord} />
                      <Text
                        style={{
                          color: "#6F6F6F",
                          fontSize: 14,
                          marginVertical: 10,
                          alignItems: "center",
                          fontFamily: "Human-beomseok",
                        }}
                      >
                        {"아직 기록하지 않았어요!"}
                      </Text>
                    </View>
                  </View>
                </Shadow>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                maxWidth: 350,
              }}
            >
              {/* {images.length > 0 || totalText ? (
                <TouchableOpacity
                  style={{ borderRadius: 24 }}
                  onPress={() =>
                    navigation.push("DetailModify", { date: selectedDate })
                  }
                >
                  <LinearGradient
                    colors={["#79BA7E", "#AFCA85"]}
                    style={{ padding: 1, borderRadius: 24 }}
                  >
                    <View style={styles.whiteButton}>
                      <WithLocalSvg asset={Edit_green} />
                      <Text
                        style={{
                          color: theme.green500,
                          fontSize: 14,
                          marginLeft: 8,
                          fontFamily: "Pretendard-Medium",
                        }}
                      >
                        {"수정하기"}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ) : ( */}
              <Shadow distance={5} startColor="#00000009" endColor="#00000000">
                <LinearGradient
                  colors={["#79BA7E", "#AFCA85"]}
                  style={styles.gradientGButton}
                >
                  <TouchableOpacity
                    style={styles.greenButton}
                    onPress={() =>
                      images.length > 0 || totalText
                        ? navigation.push("DetailModify", {
                            date: selectedDate,
                            user_id: user_id,
                          })
                        : navigation.push("SymptomCheck", {
                            date: selectedDate,
                          })
                    }
                  >
                    {images.length > 0 || totalText ? (
                      <WithLocalSvg asset={Edit_white} />
                    ) : (
                      <WithLocalSvg asset={Note_white} />
                    )}
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        lineHeight: 24,
                        marginLeft: 8,
                        fontFamily: "Pretendard-Bold",
                      }}
                    >
                      {images.length > 0 || totalText ? "수정하기" : "하루기록"}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Shadow>
              {/* )} */}

              <TouchableOpacity
                style={styles.whiteButton}
                onPress={() =>
                  navigation.push("MainVoice", { date: selectedDate })
                }
              >
                <Shadow
                  distance={5}
                  startColor="#00000009"
                  endColor="#00000000"
                >
                  <LinearGradient
                    colors={["#79BA7E", "#AFCA85"]}
                    style={{ padding: 1.4, borderRadius: 24 }}
                  >
                    <View style={styles.whiteButton}>
                      <WithLocalSvg asset={Mic} />
                      <Text
                        style={{
                          color: theme.green500,
                          fontSize: 16,
                          lineHeight: 24,
                          marginLeft: 8,
                          fontFamily: "Pretendard-Bold",
                        }}
                      >
                        {"음성기록"}
                      </Text>
                    </View>
                  </LinearGradient>
                </Shadow>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
      <CalendarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  title: {
    marginBottom: 5,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
    color: "white",
  },
  boldTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "Pretendard-Bold",
    color: "white",
  },
  header: {
    backgroundColor: "#DFF0D8",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    color: "#333",
  },
  subHeaderText: {
    fontSize: 16,
    color: "#555",
  },
  rabbitImage: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  calendar: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#F7F7F7",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  calendarTitle: {
    fontSize: 16,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dayContainer: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    color: "#888",
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  selectedDay: {
    backgroundColor: "#66BB6A",
  },
  dateText: {
    color: "#333",
  },
  recordContainer: {
    width: 320,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "white",
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recordTitle: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: theme.grey700,
  },
  dubogi: {
    fontSize: 12,
    fontFamily: "Pretendard-Bold",
    color: theme.grey400,
  },
  line: {
    height: 1,
    marginBottom: 10,
    backgroundColor: theme.grey250,
  },
  recordText: {
    fontSize: 14,
    fontFamily: "Human-beomseok",
    color: theme.grey800,
  },
  photo: {
    width: 75,
    height: 75,
    marginRight: 12,
    borderRadius: 8,
  },
  noRecord: {
    alignItems: "center",
  },
  noRecordImage: {
    width: 40,
    height: 40,
  },
  noRecordText: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gradientGButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  greenButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 184,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  whiteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 24,
    width: 124,
    justifyContent: "center",
    paddingVertical: 10,
  },
  // gradientYButton: {
  //   alignItems: "center",
  //   justifyContent: "center",
  //   borderRadius: 24,
  //   width: 119,
  //   height: 44,
  // },
  // yellowButton: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: "transparent",
  // },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modal: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
  },
});
