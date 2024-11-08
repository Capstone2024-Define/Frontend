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
  ScrollView,
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
import PloyGon from "../assets/home_polygon.svg";
import Calender from "../assets/home_calendar.svg";
import { Shadow } from "react-native-shadow-2";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import CalendarModal from "../component/CalendarModal";
import Svg, { Circle } from "react-native-svg";
import PlusBtn from "../component/PlusBtn";

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

            // 이미지 가져옴
            const response_image = await axios.get(
              `http://${ipnumber}:8080/image/show/${user_code}/${selectedDate}`
            );
            console.log("이미지 로드: ", response_image.data);
            setImages(response_image.data);
          } catch (error) {
            // 기록 없는거니까 텍스트랑 이미지 비움
            // setTotalText("");
            console.log("GET 오류: ", error);
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
    let emojiColor = null;

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
          emojiColor = null;
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
            {/* 주간 날짜 */}
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => {
                const isDisabled = isPastDate(weeks[index]); // 현재 날짜 이후인지 확인
                return (
                  <View key={index}>
                    <LinearGradient
                      colors={
                        selectedDate === weeks[index]
                          ? ["#79BA7E", "#AFCA85"] // 선택된 날짜일 때 그라데이션 색상
                          : ["transparent", "transparent"] // 선택되지 않은 날짜일 때 투명
                      }
                      style={{
                        width: 38,
                        height: 78,
                        alignItems: "center",
                        paddingVertical: 5,
                        borderRadius: 24,
                        marginBottom: 4,
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
                              : isDisabled
                              ? { color: theme.grey400 }
                              : { color: "#242424" },
                          ]}
                        >
                          {today === weeks[index] ? "오늘" : day}
                        </Text>
                        <Text
                          style={[
                            styles.subText,
                            { marginVertical: 4 },
                            selectedDate === weeks[index]
                              ? {
                                  color: "#FFFFFF",
                                  fontFamily: "Pretendard-Bold",
                                }
                              : isDisabled
                              ? { color: theme.grey400 }
                              : { color: "#242424" },
                          ]}
                        >
                          {new Date(weeks[index]).getDate()}
                        </Text>
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 60,
                            backgroundColor: emoji[index]
                              ? emoji[index]
                              : selectedDate === weeks[index]
                              ? theme.grey150
                              : theme.grey50,
                            position: "relative",
                          }}
                        >
                          {!emoji[index] && (
                            <Svg style={{ position: "absolute" }}>
                              <Circle
                                cx="10"
                                cy="10"
                                r="9.6"
                                stroke={theme.grey300}
                                strokeWidth="1"
                                strokeDasharray="2, 2" // 점선 길이와 간격 설정
                                fill="none"
                              />
                            </Svg>
                          )}
                        </View>
                      </TouchableOpacity>
                    </LinearGradient>
                    <View
                      style={{
                        width: 38,
                        height: 8,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedDate == weeks[index] && (
                        <WithLocalSvg asset={PloyGon} />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
            {/* 상세 기록 */}
            <View
              style={{
                width: "100%",
                height: 151,
                alignItems: summaryText ? "flex-start" : "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderRadius: 8,
                paddingHorizontal: 16,
              }}
            >
              {summaryText ? (
                // 기록 O
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>
                    navigation.push("DetailHistory", {
                      date: selectedDate,
                      user_code: user_code,
                      ipnumber: ipnumber,
                    })
                  }
                  style={{ width: "100%" }}
                >
                  <ScrollView
                    contentContainerStyle={{
                      flexDirection: "row",
                      marginBottom: 12,
                    }}
                  >
                    {images.length > 0 ? (
                      images.map((image, index) => (
                        <View key={index}>
                          <Image
                            source={{
                              uri: `${image}`,
                            }}
                            style={styles.photo}
                            resizeMode="cover"
                          />
                        </View>
                      ))
                    ) : (
                      <View
                        style={[
                          styles.photo,
                          { backgroundColor: theme.grey150 },
                        ]}
                      />
                    )}
                  </ScrollView>
                  <Text
                    style={styles.recordText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {summaryText.replace(/\n/g, " ")}
                  </Text>
                </TouchableOpacity>
              ) : (
                // 기록 X
                <PlusBtn
                  onPress={() =>
                    navigation.push("SymptomCheck", {
                      date: selectedDate,
                      user_code: user_code,
                      ipnumber: ipnumber,
                    })
                  }
                />
              )}
            </View>
            <View style={styles.line} />
            {/* 버튼 */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* 상담녹음 버튼 */}
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  //const today = cvtDateString(new Date());
                  navigation.push("MainVoice", {
                    date: today,
                    user_code: user_code,
                    ipnumber: ipnumber,
                  });
                }}
                style={[
                  styles.buttonContainer,
                  { width: "57%", marginRight: 12 },
                ]}
              >
                <View style={{ height: "100%" }}>
                  <Text style={[styles.boldTitle, { marginBottom: 4 }]}>
                    상담녹음
                  </Text>
                  <Text style={styles.subText}>
                    상담내용을 빠르게{"\n"}음성으로 기록해요
                  </Text>
                </View>
                <View
                  style={{
                    height: "100%",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Image
                    source={require("../assets/home_mike.png")}
                    resizeMode="contain"
                    style={{ width: 52, height: 68 }}
                  />
                </View>
              </TouchableOpacity>
              {/* 내보내기 버튼 */}
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  navigation.push("ExportRecord", {
                    user_code: user_code,
                    ipnumber: ipnumber,
                  });
                }}
                style={[styles.buttonContainer, { width: "39%" }]}
              >
                <View style={{ height: "100%" }}>
                  <Text style={[styles.boldTitle, { marginBottom: 4 }]}>
                    내보내기
                  </Text>
                  <Text style={styles.subText}>
                    기록을 문서파일로{"\n"}정리해드려요
                  </Text>
                </View>

                <Image
                  source={require("../assets/home_export.png")}
                  resizeMode="contain"
                  style={{
                    width: 58,
                    height: 57,
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                  }}
                />
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
  subText: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
  },
  line: {
    width: "100%",
    height: 1,
    marginVertical: 15,
    backgroundColor: "#EBEBEB",
    borderRadius: 20,
  },
  recordText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
    color: theme.grey800,
  },
  photo: {
    width: 75,
    height: 75,
    marginRight: 12,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    height: 135,
    justifyContent: "space-between",
    borderRadius: 16,
    backgroundColor: "white",
    paddingLeft: 16,
    paddingTop: 12,
    paddingBottom: 4,
    paddingRight: 4,
  },
});
