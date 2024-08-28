import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useEffect, useCallback } from "react";
import VoiceModifyScreen from "./VoiceModifyScreen";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import Note from "../assets/notes.svg";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import summary from "./SummaryAPI";

// 음성녹음 창에서 올때는 이 날 기록보기, 삭제하기를 띄움
// 기록 창에서 올때는 삭제하기만 띄움
const Modal2 = ({ visible, detail, onClose, onRemove, onShowRecord }) => {
  // 이동 위한 내비게이션 추가
  const navigation = useNavigation();

  // 애니메이션
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          {!detail ? (
            <Animated.View
              style={[
                styles.modal3,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  Alert.alert(
                    "삭제",
                    "정말로 삭제하시겠어요?",
                    [
                      { text: "취소", style: "cancel" },
                      {
                        text: "삭제",
                        onPress: () => {
                          onRemove();
                          navigation.pop();
                        },
                        style: "destructive",
                      },
                    ],
                    {
                      // 안드로이드에서 Alert 박스 바깥 영역을 터치하거나
                      // Back버튼 눌렀을 때 Alert가 닫히도록 설정(cancelable)
                      // onDismiss는 Alert가 닫힐 때 호출되는 함수
                      cancelable: true,
                      onDismiss: () => {},
                    }
                  );
                }}
              >
                <Text style={{ ...styles.modal2Text, marginBottom: 0 }}>
                  삭제하기
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.modal2,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  onShowRecord();
                }}
              >
                <Text style={styles.modal2Text}>이 날 기록 보기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  Alert.alert(
                    "삭제",
                    "정말로 삭제하시겠어요?",
                    [
                      { text: "취소", style: "cancel" },
                      {
                        text: "삭제",
                        onPress: () => {
                          onRemove();
                          navigation.pop();
                        },
                        style: "destructive",
                      },
                    ],
                    {
                      // 안드로이드에서 Alert 박스 바깥 영역을 터치하거나
                      // Back버튼 눌렀을 때 Alert가 닫히도록 설정(cancelable)
                      // onDismiss는 Alert가 닫힐 때 호출되는 함수
                      cancelable: true,
                      onDismiss: () => {},
                    }
                  );
                }}
              >
                <Text style={styles.modal2Text}>삭제하기</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function DetailVoiceScreen({ navigation, route }) {
  // 모달창 상태
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [text, setText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [voiceList, setVoiceList] = useState([]); // 스토리지 내용
  const [realDate, setRealDate] = useState("");

  const { place, date, time } = route.params;

  // 기록 불러오기
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const rawVoice = await AsyncStorage.getItem("voice");
          if (rawVoice) {
            const data = JSON.parse(rawVoice);
            setVoiceList(data);

            // 목표하는 date와 time
            const targetDate = date;
            const targetTime = time;

            // date와 time이 모두 일치하는 객체 필터링
            const filtered = data.filter(
              (item) => item.date === targetDate && item.time === targetTime
            );

            setText(filtered[0].text);
            setRealDate(filtered[0].realDate);
          }
        } catch (error) {
          console.error("데이터 불러오기 실패:", error);
        }
      };

      fetchData();
    }, [route.params])
  );

  // 네이버 summary api
  useFocusEffect(
    useCallback(() => {
      const handleSummary = async () => {
        try {
          const result = await summary(text);
          setSummaryText(result.summary);
          // console.log(result.summary);
        } catch (error) {
          console.log("서머리 에러", error.response.data.error.errorCode);
        }
      };

      if (text) {
        handleSummary();
      }
    }, [text])
  );

  // 기록 삭제 함수
  const remove = async () => {
    console.log(date);
    console.log(time);
    const updatedList = voiceList.filter(
      (voice) => !(voice.date === date && voice.time === time)
    );
    try {
      // 수정된 배열을 AsyncStorage에 저장
      await AsyncStorage.setItem("voice", JSON.stringify(updatedList));
      console.log(updatedList);
    } catch (error) {
      console.error("객체 수정 실패:", error);
    }
  };

  // 이 날 기록보기 함수
  const showRecord = async () => {
    try {
      const rawRecord = await AsyncStorage.getItem(date);
      if (rawRecord) {
        navigation.navigate("DetailHistory", { date: date });
      } else {
        navigation.navigate("DetailNone", { date: date });
      }
    } catch (e) {
      console.log("기록 로드 에러");
    }
  };

  // 날짜를 형식에 맞게 바꿔주는 함수
  const getDate = (date) => {
    const newDate = new Date(date);

    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const dayName = dayOfWeek[newDate.getDay()];

    return `${month}.${day} ${dayName}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.pop()}>
          <Ionicons name="close" size={24} color={theme.grey800} />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible1(true)}
          >
            <Text style={styles.headerText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible2(true)}
          >
            <View style={styles.space}>
              <FontAwesome
                name="circle"
                size={3.5}
                color={theme.grey400}
                style={{ marginVertical: 1.2 }}
              />
              <FontAwesome
                name="circle"
                size={3.5}
                color={theme.grey400}
                style={{ marginVertical: 1.2 }}
              />
              <FontAwesome
                name="circle"
                size={3.5}
                color={theme.grey400}
                style={{ marginVertical: 1.2 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoHeader}>
        {place === "school" ? (
          <WithLocalSvg width={20} height={20} asset={School} />
        ) : (
          <WithLocalSvg width={20} height={20} asset={Hospital} />
        )}
        <Text style={styles.date}>{getDate(date)}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.summaryBox}>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <WithLocalSvg width={20} height={20} asset={Note} />
          <Text style={styles.summaryTitle}>음성 기록을 요약했어요</Text>
        </View>
        <Text style={styles.summaryText}>{summaryText}</Text>
      </View>
      <ScrollView>
        <Text style={{ ...styles.text, paddingBottom: 20 }}>{text}</Text>
      </ScrollView>
      <VoiceModifyScreen
        visible={visible1}
        date={route.params.date}
        time={route.params.time}
        onClose={() => setVisible1(false)}
        onUpdateText={(updatedText) => setText(updatedText)}
      />
      <Modal2
        visible={visible2}
        detail={route.params.detail}
        onClose={() => setVisible2(false)}
        onRemove={remove}
        onShowRecord={showRecord}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 17,
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  headerText: {
    fontSize: 16,
    marginRight: 12,
    fontFamily: "Pretendard-Medium",
    color: theme.green500,
  },
  space: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    marginHorizontal: 8,
    color: theme.grey700,
  },
  time: {
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    color: theme.grey500,
  },
  summaryBox: {
    width: 312,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.grey50,
    marginBottom: 26,
  },
  summaryTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: theme.grey600,
  },
  summaryText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    lineHeight: 20,
    color: theme.grey500,
  },
  text: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    lineHeight: 20,
    color: theme.grey700,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#1212125C",
  },
  modal2: {
    width: "100%",
    height: 156,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 28,
    paddingBottom: 56,
    paddingHorizontal: 35,
    backgroundColor: "white",
  },
  modal2Text: {
    marginBottom: 24,
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    color: theme.grey700,
  },
  modal3: {
    width: "100%",
    height: 95,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 28,
    paddingBottom: 43,
    paddingHorizontal: 35,
    backgroundColor: "white",
  },
});
