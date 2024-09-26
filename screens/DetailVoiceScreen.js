import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  SafeAreaView,
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
import Edit from "../assets/modal_blackEdit.svg";
import Delete from "../assets/modal_redDelete.svg";
import TodayRecord from "../assets/modal_blackNotes.svg";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import summary from "./SummaryAPI";
import RemoveAlert from "../component/RemoveAlert";

// 음성녹음 창에서 올때는 이 날 기록보기, 삭제하기를 띄움
// 기록 창에서 올때는 삭제하기만 띄움
const Modal2 = ({
  visible,
  detail,
  onClose,
  onShowRecord,
  setVisible1,
  setRemoveModalVisible,
}) => {
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
        <View style={theme.modalBackground}>
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
                  onClose();
                  setVisible1(true);
                }}
                style={{
                  flexDirection: "row",
                  paddingVertical: 3,
                  marginBottom: 20,
                }}
              >
                <WithLocalSvg asset={Edit} style={{ marginRight: 12 }} />
                <Text style={{ ...styles.modalText, color: theme.grey800 }}>
                  수정하기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setRemoveModalVisible(true);
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  paddingVertical: 3,
                  marginBottom: 23,
                }}
              >
                <WithLocalSvg asset={Delete} style={{ marginRight: 12 }} />
                <Text style={{ ...styles.modalText, color: "#F05757" }}>
                  삭제하기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onClose}
                style={styles.button}
              >
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 20,
                    fontFamily: "Pretendard-Medium",
                    color: "white",
                  }}
                >
                  닫기
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
                style={{
                  flexDirection: "row",
                  paddingVertical: 3,
                  marginBottom: 20,
                }}
              >
                <WithLocalSvg asset={TodayRecord} style={{ marginRight: 12 }} />
                <Text style={{ ...styles.modalText, color: theme.grey800 }}>
                  이 날 하루기록보기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  onClose();
                  setVisible1(true);
                }}
                style={{
                  flexDirection: "row",
                  paddingVertical: 3,
                  marginBottom: 20,
                }}
              >
                <WithLocalSvg asset={Edit} style={{ marginRight: 12 }} />
                <Text style={{ ...styles.modalText, color: theme.grey800 }}>
                  수정하기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setRemoveModalVisible(true);
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  paddingVertical: 3,
                  marginBottom: 23,
                }}
              >
                <WithLocalSvg asset={Delete} style={{ marginRight: 12 }} />
                <Text style={{ ...styles.modalText, color: "#F05757" }}>
                  삭제하기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onClose}
                style={styles.button}
              >
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 20,
                    fontFamily: "Pretendard-Medium",
                    color: "white",
                  }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function DetailVoiceScreen({ navigation, route }) {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false); // 모달창 상태
  const [text, setText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [voiceList, setVoiceList] = useState([]); // 스토리지 내용
  const [realDate, setRealDate] = useState("");
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible1(true)}
          >
            <Text style={styles.headerText}>수정</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible2(true)}
          >
            <View style={styles.space}>
              <FontAwesome
                name="circle"
                size={3.5}
                color={theme.green500}
                style={{ marginVertical: 1.2 }}
              />
              <FontAwesome
                name="circle"
                size={3.5}
                color={theme.green500}
                style={{ marginVertical: 1.2 }}
              />
              <FontAwesome
                name="circle"
                size={3.5}
                color={theme.green500}
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
        onShowRecord={showRecord}
        setVisible1={setVisible1}
        setRemoveModalVisible={setRemoveModalVisible}
      />
      <RemoveAlert
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onRemove={remove}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 17,
    paddingHorizontal: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 28,
    paddingHorizontal: 4,
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 20,
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
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.grey50,
    marginBottom: 26,
  },
  summaryTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  summaryText: {
    fontSize: 14,
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
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
  },
  // 음성기록에서 뜨는 모달
  modal2: {
    width: "100%",
    height: 236,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 22,
    paddingBottom: 17,
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  // 하루기록 -> 음성기록(이날 기록보기가 안뜸)
  modal3: {
    width: "100%",
    height: 184,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 22,
    paddingBottom: 15,
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    paddingHorizontal: 36,
    paddingVertical: 12,
    backgroundColor: theme.grey200,
  },
});
