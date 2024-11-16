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
import { theme } from "../colors/color";
import { useFocusEffect } from "@react-navigation/native";
import { WithLocalSvg } from "react-native-svg/css";
import Rabbit from "../assets/homeRabbit.svg";
import PloyGon from "../assets/home_polygon.svg";
import Calender from "../assets/home_calendar.svg";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import CalendarModal from "../component/CalendarModal";
import Svg, { Circle } from "react-native-svg";
import PlusBtn from "../component/PlusBtn";
import DaysModal from "../component/DaysModal";

// 홈 스크린
export default function HomeScreen({ navigation, route }) {
  const { ipnumber, user_code } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [dayModalvisible, setDayModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [weeks, setWeeks] = useState([]);
  const [images, setImages] = useState([]);
  // const [totalText, setTotalText] = useState("");
  const [emoji, setEmoji] = useState([]);
  const [summaryText, setSummaryText] = useState("");
  // const [totalDay, setTotalDay] = useState(0);
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  const [consecutiveDay, setConsecutiveDay] = useState(0);
  const [adviseTitle, setAdviseTitle] = useState("");
  const checklistBadItems = [
    "욕을 했어요",
    "무시하는 말을 했어요",
    "아이의 말을 자르고 하고 싶은 말을 했어요",
    "“항상”, “절대”라는 표현을 사용했어요",
    "오랫동안 잔소리를 했어요",
    "다른 곳을 보면서 말했어요",
    "서서 혹은 걸어 다니면서 말했어요",
    "높고 날카로운 어조로 말했어요",
    "한번에 여러가지 문제를 말했어요",
    "최악의 상황을 생각해서 말했어요",
    "과거를 들추어서 말했어요",
    "말하고 싶지 않을때 침묵했어요",
    "벌컥 화를 냈어요",
    "내가 한 일을 부정했어요",
    "아이의 작은 실수를 잔소리 했어요",
  ];
  const checklistGoodItems = [
    `아이에게 상처주지 않는${"\n"}말로 표현해봐요!`,
    `아이에게 화난 이유를${"\n"}차분하게 설명해봐요!`,
    `아이에게 차례를 기다리고${"\n"}짧게 말해봐요!`,
    `“대부분”, “가끔”이라는${"\n"}표현을 사용해봐요!`,
    `잔소리는 핵심적인 내용만${"\n"}짧게 말해봐요!`,
    `아이와 눈을 맞추며${"\n"}말해봐요!`,
    `앉아서 주의를 기울이며${"\n"}말해봐요!`,
    `차분하고 침착한 어조로${"\n"}말해봐요!`,
    `한번에 하나의 문제만${"\n"}말해봐요!`,
    `넘겨짚어 생각하지${"\n"}말아요!`,
    `지금의 문제에만${"\n"}집중해봐요!`,
    `느끼는 것을 솔직하게${"\n"}표현해봐요!`,
    `화가 났을땐${"\n"}다른 장소에서 진정해봐요!`,
    `자신이 한 일을 인정하고${"\n"}오해를 풀어봐요!`,
    `누구도 완벽하진 못해요${"\n"}사소한 일은 넘어가주세요!`,
  ];

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

  // 연속 날짜, 가장 최근 체크리스트 로드
  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          // 연속 날짜 로드
          const response_consecutiveDays = await axios.get(
            `http://${ipnumber}:8080/daily/consecutive/${user_code}`
          );
          // console.log("연속 일자: ", response_consecutiveDays.data);
          setConsecutiveDay(response_consecutiveDays.data);

          // 가장 최근 체크리스트 로드
          const response_resentChecklist = await axios.get(
            `http://${ipnumber}:8080/prnt/recent/${user_code}`
          );
          // console.log("최근 체크리스트: ", response_resentChecklist.data);

          // 체크된 항목 중 랜덤으로 한개를 뽑음
          if (response_resentChecklist.data.length > 0) {
            const randomChecklist =
              response_resentChecklist.data[
                Math.floor(Math.random() * response_resentChecklist.data.length)
              ];
            console.log("랜덤 체크리스트: ", randomChecklist);
            checklistBadItems.forEach((item, index) => {
              if (randomChecklist === item) {
                setAdviseTitle(checklistGoodItems[index]);
              }
            });
          } else {
            const randomIndex = Math.floor(Math.random() * 15);
            console.log("랜덤 체크리스트: ", checklistBadItems[randomIndex]);
            setAdviseTitle(checklistGoodItems[randomIndex]);
          }
        } catch (error) {
          console.log("연속 기록/체크리스트 로드 에러 ", error);
        }
      }
      load();
    }, [])
  );

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
            setSummaryText(response.data.summary);

            // 이미지 가져옴
            const response_image = await axios.get(
              `http://${ipnumber}:8080/image/show/${user_code}/${selectedDate}`
            );
            setImages(response_image.data);
          } catch (error) {
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
    // console.log("주간 날짜: ", newWeeks);
    setWeeks(newWeeks);
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜를 자정으로 설정하여 시각 제거

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

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
              marginTop: 1,
              marginLeft: 25,
              marginRight: 6,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                marginRight: 6,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setDayModalVisible(true)}
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
                  {`${consecutiveDay}일 `}
                  <Text style={{ fontFamily: "Pretendard-Medium" }}>
                    연속기록중!
                  </Text>
                </Text>
              </TouchableOpacity>
              <Text style={[styles.title, { marginVertical: 8 }]}>
                {adviseTitle}
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
                  <Text
                    style={[
                      styles.subText,
                      { lineHeight: 17, color: theme.grey500 },
                    ]}
                  >
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
                  <Text
                    style={[
                      styles.subText,
                      { lineHeight: 17, color: theme.grey500 },
                    ]}
                  >
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
      <DaysModal
        ipnumber={ipnumber}
        user_code={user_code}
        visible={dayModalvisible}
        closeModal={() => setDayModalVisible(false)}
        consecutiveDay={consecutiveDay}
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
