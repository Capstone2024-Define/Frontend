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
  Dimensions,
  ImageBackground,
} from "react-native";
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { theme } from "../colors/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { WithLocalSvg } from "react-native-svg/css";
import Rabbit from "../assets/homeRabbit.svg";
import Edit from "../assets/edit.svg";
import Mic from "../assets/mic.svg";
import Left from "../assets/chevron_left.svg";
import Right from "../assets/chevron_right.svg";
import Calender from "../assets/calendar.svg";
import NoRecord from "../assets/norecord.svg";

// 화면 크기 가져오기
const SCREEN_HEIGHT = Dimensions.get("window").height;

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
  const [moods, setMoods] = useState({});

  useEffect(() => {
    const date = cvtDateString(new Date());
    setSelectedDate(date);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedDate) {
        getWeeks(selectedDate);

        // 기록 로드
        async function load() {
          try {
            const rawRecord = await AsyncStorage.getItem(selectedDate);
            const newRecord = JSON.parse(rawRecord);

            let newTotalText = "";
            if (newRecord.home) {
              newTotalText += newRecord.home;
            }
            if (newRecord.school) {
              newTotalText += ` ${newRecord.school}`;
            }
            if (newRecord.hospital) {
              newTotalText += ` ${newRecord.hospital}`;
            }
            setText(newTotalText);
            setImages(newRecord.image);

            //console.log(newRecord);
          } catch (e) {
            console.log("기록 로드 에러");
          }
        }
        load();
      }
    }, [selectedDate])
  );

  useEffect(() => {
    const fetchEmojiColors = async () => {
      const newEmoji = [];
      for (let i = 0; i < weeks.length; i++) {
        try {
          const color = await getEmojiColor(weeks[i]);
          newEmoji.push(color);
        } catch (error) {
          console.error("fetchEmojiColors 에러", error);
        }
      }
      //console.log(newEmoji);
      setEmoji(newEmoji);
    };

    fetchEmojiColors();
  }, [weeks]);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const cvtDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  const getWeekNumber = (date) => {
    const dateFrom = new Date(date);
    const currentDate = dateFrom.getDate();
    const startOfMonth = new Date(dateFrom.setDate(1));
    const weekDay = startOfMonth.getDay();

    return parseInt((weekDay - 1 + currentDate) / 7) + 1;
  };

<<<<<<< HEAD
  const fetchData = async () => {
    // 서버에서 데이터를 받아오는 로직 예시
    const data = {
      "2024-06-09": "green",
    };
    setMoods(data);
  };
=======
  // const renderEmoji = (emoji, index) => (
  //   <TouchableOpacity
  //     key={index}
  //     onPress={() => setMoods({ ...moods, [selectedDate]: emoji })}
  //   >
  //     <Text
  //       style={[
  //         styles.emoji,
  //         moods[selectedDate] === emoji ? styles.selectedEmoji : null,
  //       ]}
  //     >
  //       {emoji}
  //     </Text>
  //   </TouchableOpacity>
  // );

  // const fetchData = async () => {
  //   // 서버에서 데이터를 받아오는 로직 예시
  //   const data = {
  //     "2024-06-09": "green",
  //   };
  //   setMoods(data);
  // };
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89

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

<<<<<<< HEAD
  const getMoodColor = (date) => {
    return moods[date] || "#D3D3D3";
  };
=======
  // const getMoodColor = (date) => {
  //   return moods[date] || "#D3D3D3";
  // };
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89

  const isPastDate = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return today < compareDate;
  };

<<<<<<< HEAD
=======
  // 이모지 색 컬러
  const getEmojiColor = async (date) => {
    let emojiColor = theme.grey50;

    try {
      const rawRecord = await AsyncStorage.getItem(date);
      if (rawRecord !== null) {
        const record = JSON.parse(rawRecord);
        if (record.checkList) {
          const selectedCount = record.checkList.length;
          if (selectedCount <= 3) {
            emojiColor = theme.pink;
          } else if (selectedCount <= 9) {
            emojiColor = theme.yellow;
          } else {
            emojiColor = theme.green;
          }
        }
      }

      return emojiColor;
    } catch (error) {
      console.log("getEmojiColor 에러", error);
    }
  };

>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
      >
<<<<<<< HEAD
        <View>
=======
        <View style={{ flex: 1 }}>
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
          <View
            style={{
              flexDirection: "row",
              marginTop: 17,
              marginLeft: 29,
              marginRight: 16,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                marginBottom: 18,
              }}
            >
              <Text style={styles.title}>{"오늘도 같이 기록해볼까요?"}</Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text style={styles.boldTitle}>12일째 </Text>
                <Text style={styles.title}>기록하는 중</Text>
              </View>
            </View>
<<<<<<< HEAD
            <Image
              source={require("../assets/homerabbit.png")}
              resizeMode={"stretch"}
              style={{ width: 132, height: 142, marginTop: 12, marginBottom: -14 }}
            />
=======
            <WithLocalSvg asset={Rabbit} />
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#FEFCF4",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 24,
              paddingBottom: 14,
              paddingHorizontal: 24,
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
                  color: "#555555",
                  fontSize: 14,
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
<<<<<<< HEAD
                <Image
                  source={require("../assets/chevron_left.png")}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleWeekChange(1)}>
                <Image
                  source={require("../assets/chevron_right.png")}
                  style={{ width: 24, height: 24 }}
                />
=======
                <WithLocalSvg asset={Left} style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleWeekChange(1)}>
                <WithLocalSvg asset={Right} />
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                paddingVertical: 8,
                marginBottom: 16,
                width: "100%", // 부모 뷰의 전체 너비를 사용
                maxWidth: 350, // 최대 너비 설정
                paddingHorizontal: 16, // 내부 패딩
              }}
            >
              {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: 9,
                    paddingHorizontal: 4,
                    backgroundColor:
<<<<<<< HEAD
                      selectedDate === weeks[index] ? "#78BA7D" : "transparent",
=======
                      selectedDate === weeks[index]
                        ? theme.green500
                        : "transparent",
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
                    borderRadius: selectedDate === weeks[index] ? 24 : 0,
                  }}
                  onPress={() => setSelectedDate(weeks[index])}
                >
                  <Text
                    style={{
                      color:
                        selectedDate === weeks[index] ? "#FFFFFF" : "#242424",
                      fontSize: 12,
                      marginBottom: 7,
                      textAlign: "center",
<<<<<<< HEAD
                      fontWeight: selectedDate === weeks[index] ? "bold" : "normal",
=======
                      fontFamily:
                        selectedDate === weeks[index]
                          ? "Pretendard-Bold"
                          : "Pretendard-Regular",
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
                    }}
                  >
                    {day}
                  </Text>
                  <Text
                    style={{
                      color:
<<<<<<< HEAD
                        selectedDate === weeks[index] ? "#FFFFFF" : isPastDate(weeks[index]) ? "#A9A9A9" : "#242424",
                      fontSize: 12,
                      marginBottom: 7,
                      textAlign: "center",
                      fontWeight: selectedDate === weeks[index] ? "bold" : "normal",
=======
                        selectedDate === weeks[index]
                          ? "#FFFFFF"
                          : isPastDate(weeks[index])
                          ? "#A9A9A9"
                          : "#242424",
                      fontSize: 12,
                      marginBottom: 7,
                      textAlign: "center",
                      fontFamily:
                        selectedDate === weeks[index]
                          ? "Pretendard-Bold"
                          : "Pretendard-Regular",
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
                    }}
                  >
                    {new Date(weeks[index]).getDate()}
                  </Text>
<<<<<<< HEAD
                  <View
=======
                  <FontAwesome name="circle" size={20} color={emoji[index]} />
                  {/* <View
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: getMoodColor(weeks[index]),
                      marginTop: 4,
                    }}
<<<<<<< HEAD
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                backgroundColor: "#FBFBFB",
                borderRadius: 8,
                paddingTop: 15,
                paddingBottom: 37,
                marginBottom: 36,
                width: "100%", // 부모 뷰의 전체 너비를 사용
                maxWidth: 350, // 최대 너비 설정
                alignItems: "center", // 네모 박스들을 중앙 정렬
              }}
            >
              <Text
                style={{
                  color: "#333333",
                  fontSize: 14,
                  marginBottom: 108,
                  fontFamily: "Pretendard-Bold",
                  textAlign: "left", // 왼쪽 정렬
                  alignSelf: "flex-start", // 텍스트를 부모 뷰의 왼쪽에 정렬
                  marginLeft: 17, // 왼쪽 패딩 추가
                }}
              >
                {`${new Date(selectedDate).getMonth() + 1}.${new Date(
                  selectedDate
                ).getDate()} ${["일", "월", "화", "수", "목", "금", "토"][
                  new Date(selectedDate).getDay()
                ]}요일${isToday(selectedDate) ? " (오늘)" : ""}`}
              </Text>
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../assets/homechecklist.png")}
                  resizeMode={"stretch"}
                  style={{ marginTop: -40, width: 67.1, height: 70 }}
                />
                <Text
                  style={{
                    color: "#6F6F6F",
                    fontSize: 14,
                    marginTop: 5,
                    alignItems: "center",
                    fontFamily: "Human-beomseok",
                    marginBottom: 16,
=======
                  /> */}
                </TouchableOpacity>
              ))}
            </View>
            {images.length > 0 || text ? (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.recordContainer}
                  activeOpacity={0.5}
                  onPress={() =>
                    navigation.push("DetailHistory", { date: selectedDate })
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
                    {text.slice(0, 92).replace(/\n/g, " ")}...
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    width: 312,
                    height: 188,
                    backgroundColor: "#FBFBFB",
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginBottom: 36,
                    alignItems: "center", // 네모 박스들을 중앙 정렬
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
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
                        marginTop: 10,
                        alignItems: "center",
                        fontFamily: "Human-beomseok",
                      }}
                    >
                      {"아직 기록하지 않았어요!"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
<<<<<<< HEAD
                maxWidth: 350, 
              }}
            >
              <TouchableOpacity
                style={styles.greenButton} 
=======
                maxWidth: 350,
              }}
            >
              <TouchableOpacity
                style={styles.greenButton}
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
                onPress={() =>
                  navigation.push("SymptomCheck", { date: selectedDate })
                }
              >
<<<<<<< HEAD
                <Image
                  source={require("../assets/edit.png")}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>{"하루기록"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.yellowButton} // 스타일 적용
                onPress={() => navigation.push("MainVoice")}
              >
                <Image
                  source={require("../assets/mic.png")}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>{"음성기록"}</Text>
=======
                <WithLocalSvg asset={Edit} />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    marginLeft: 8,
                    fontFamily: "Pretendard-Medium",
                  }}
                >
                  {"하루기록"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.yellowButton}
                onPress={() => navigation.push("MainVoice")}
              >
                <WithLocalSvg asset={Mic} />
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    marginLeft: 8,
                    fontFamily: "Pretendard-Medium",
                  }}
                >
                  {"음성기록"}
                </Text>
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
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
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: "white",
  },
  boldTitle: {
    fontSize: 18,
    fontFamily: "Pretendard-Medium",
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
    width: 312,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
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
  greenButton: {
    flexDirection: "row",
    alignItems: "center",
<<<<<<< HEAD
    backgroundColor: "#78BA7D",
=======
    backgroundColor: theme.green500,
>>>>>>> 34e2739a16e44a4b0f56b8f6b7bff15ca58e7b89
    borderRadius: 24,
    width: 177,
    height: 44,
    justifyContent: "center",
    marginRight: 16,
  },
  yellowButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5DE8F",
    borderRadius: 24,
    width: 119,
    height: 44,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 8,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
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
