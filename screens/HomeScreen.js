import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  StatusBar,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { theme } from "../colors/color";
import { useFocusEffect } from "@react-navigation/native";
import { WithLocalSvg } from "react-native-svg/css";
import Rabbit from "../assets/homeRabbit.svg";
import Edit_white from "../assets/edit_white.svg";
import Note_white from "../assets/notes_white.svg";
import Mic from "../assets/mic_green.svg";
import Left from "../assets/chevron_left.svg";
import Right from "../assets/chevron_right.svg";
import Calender from "../assets/home_calendar.svg";
import { Shadow } from "react-native-shadow-2";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import CalendarModal from "../component/CalendarModal";

// 홈 스크린
export default function HomeScreen({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [weeks, setWeeks] = useState([]);
  const [images, setImages] = useState([]);
  // const [totalText, setTotalText] = useState("");
  const [emoji, setEmoji] = useState([]);
  const [summaryText, setSummaryText] = useState("");
  const [totalDay, setTotalDay] = useState(0);
  const { ipnumber, user_code } = route.params;
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });

  // 상태바 변경(안드로이드)
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "android") {
        StatusBar.setBarStyle("light-content");
        StatusBar.setBackgroundColor("#82BC7F");
      }

      // Android에서 다른 화면으로 나갈 때 상태바 기본값으로 복구
      return () => {
        if (Platform.OS === "android") {
          StatusBar.setBarStyle("dark-content");
          StatusBar.setBackgroundColor("#FFFFFF"); // Android 기본 배경색
        }
      };
    }, [])
  );

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
            // 요약, 상태 가져옴
            const response = await axios.get(
              `http://${ipnumber}:8080/daily/records/${user_code}/${selectedDate}`
            );

            // console.log("GET: ", response.data);
            // setTotalText(response.data.summary);
            setSummaryText(response.data.summary);
            console.log("서머리: ", response.data.summary);
            // 몇일째 기록하는중인지 가져옴
            const response_total = await axios.get(
              `http://${ipnumber}:8080/daily/records/${user_code}`
            );
            setTotalDay(response_total.data.length);
          } catch (e) {
            // 기록 없는거니까 텍스트랑 이미지 비움
            // setTotalText("");
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
      const response = await axios.get(
        `http://${ipnumber}:8080/daily/records/${user_code}/${date}`
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
      // 하루기록이 없음
    }
    return emojiColor;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/home_background.png")}
        style={styles.backgroundImage}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              marginTop: 4,
              marginLeft: 25,
              marginRight: 6,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                marginRight: 28,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                style={{ flexDirection: "row" }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    backgroundColor: theme.green50,
                    marginRight: 8,
                  }}
                >
                  <Image
                    source={require("../assets/check.png")}
                    resizeMode="contain"
                    style={{ width: 13 }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 20,
                    fontFamily: "Pretendard-Bold",
                    color: "white",
                  }}
                >
                  7일
                </Text>
              </TouchableOpacity>
              <Text style={[styles.title, { marginVertical: 8 }]}>
                아이에게 상처주지 않는 말로 표현해봐요!
              </Text>
            </View>
            <WithLocalSvg asset={Rabbit} />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: theme.grey100,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingVertical: 16,
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text style={[styles.boldTitle, { marginLeft: 8 }]}>
                {`${new Date(selectedDate).getFullYear()}년 ${
                  new Date(selectedDate).getMonth() + 1
                }월`}
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setModalVisible(true)}
                style={{ marginLeft: 4 }}
              >
                <WithLocalSvg asset={Calender} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => {
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
                        style={[
                          styles.subText,
                          selectedDate === weeks[index]
                            ? {
                                color: "#FFFFFF",
                                fontFamily: "Pretendard-Bold",
                              }
                            : { color: "#242424" },
                        ]}
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
              })}
            </View>

            {images.length > 0 || summaryText ? (
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
                        user_code: user_code,
                        ipnumber: ipnumber,
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
                    <Text
                      style={styles.recordText}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {/* {summaryText && summaryText !== ""
                        ? summaryText.slice(0, 92).replace(/\n/g, " ")
                        : totalText.slice(0, 92).replace(/\n/g, " ")} */}
                      {/* {summaryText &&
                        summaryText.slice(0, 95).replace(/\n/g, " ")}
                      ... */}
                      {summaryText.replace(/\n/g, " ")}
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
                      style={{ ...styles.line, marginTop: 10, marginBottom: 0 }}
                    />
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* <WithLocalSvg asset={NoRecord} /> */}
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
                      images.length > 0 || summaryText
                        ? navigation.push("DetailModify", {
                            date: selectedDate,
                            user_code: user_code,
                            ipnumber: ipnumber,
                          })
                        : navigation.push("SymptomCheck", {
                            date: selectedDate,
                            user_code: user_code,
                            ipnumber: ipnumber,
                          })
                    }
                  >
                    {images.length > 0 || summaryText ? (
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
                      {images.length > 0 || summaryText
                        ? "수정하기"
                        : "하루기록"}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Shadow>
              {/* )} */}

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.whiteButton}
                onPress={() => {
                  const today = cvtDateString(new Date());
                  navigation.push("MainVoice", {
                    date: today,
                    user_code: user_code,
                    ipnumber: ipnumber,
                  });
                }}
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
        currentDate={selectedDate}
        setHomeSelectedDate={setSelectedDate}
        user_code={user_code}
        ipnumber={ipnumber}
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
    resizeMode: "contain",
  },
  boldTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    color: theme.grey700,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
    color: "white",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dayContainer: {
    alignItems: "center",
  },
  subText: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
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
    width: "100%",
    height: 1,
    marginBottom: 10,
    backgroundColor: theme.grey250,
    borderRadius: 40,
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
