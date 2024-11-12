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
import ModalCloseButton from "../component/ModalCloseButton";
import summarize from "./ChatgptAPI";
import axios from "axios";

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
              <ModalCloseButton onClose={onClose} />
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
                  이 날 기록보기
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
              <ModalCloseButton onClose={onClose} />
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function VoiceDetailScreen({ navigation, route }) {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false); // 모달창 상태
  const [text, setText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [voice, setVoice] = useState({});
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

  const { user_code, timestamp, ipnumber } = route.params;

  // 기록 불러오기
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const rawVoice = await axios.get(
            `http://${ipnumber}:8080/record/list/${user_code}/${timestamp}`
          );
          // console.log("음성녹음: ", rawVoice.data);
          if (rawVoice.data) {
            setVoice(rawVoice.data);
            setText(rawVoice.data.contents);
            console.log(rawVoice.data.contents);
          }
        } catch (error) {
          console.error("GET 에러:", error);
        }
      };

      load();
    }, [route.params])
  );

  // 네이버 summary api
  useFocusEffect(
    useCallback(() => {
      const handleSummary = async () => {
        try {
          // 서머리
          // const result = await summary(text);
          // 챗지피티 (요금때문에 일단 주석)
          let summarizeText = "";

          if (text.length > 50) {
            summarizeText = await summarize(text);
          } else {
            summarizeText = text;
          }
          setSummaryText(summarizeText);
          console.log(summarizeText);
        } catch (error) {
          console.log("챗지피티 요약 에러", error);
        }
      };

      if (text) {
        handleSummary();
      }
    }, [text])
  );

  // 기록 삭제 함수
  const remove = async () => {
    try {
      await axios.delete(
        `http://${ipnumber}:8080/record/delete/${user_code}/${timestamp}`
      );
    } catch (error) {
      console.error("객체 수정 실패:", error);
    }
  };

  // 이 날 기록보기 함수
  const showRecord = async () => {
    try {
      const record = await axios.get(
        `http://${ipnumber}:8080/daily/records/${user_code}/${getYYYYMMDD(
          timestamp
        )}`
      );

      if (record.data) {
        navigation.navigate("DetailHistory", {
          user_code: user_code,
          date: getYYYYMMDD(timestamp),
          ipnumber: ipnumber,
        });
      } else {
        navigation.navigate("DetailNone", {
          date: getYYYYMMDD(timestamp),
          ipnumber: ipnumber,
          user_code: user_code,
        });
      }
    } catch (e) {
      console.log("하루 기록 GET 에러 : ", error);
    }
  };

  const getYYYYMMDD = (date) => {
    const newdate = new Date(date);

    return `${newdate.getFullYear()}-${String(newdate.getMonth() + 1).padStart(
      2,
      0
    )}-${String(newdate.getDate()).padStart(2, 0)}`;
  };

  // 날짜를 형식에 맞게 바꿔주는 함수
  const getDate = (date) => {
    const newDate = new Date(date);

    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const dayName = dayOfWeek[newDate.getDay()];

    return `${month}월 ${day}일 ${dayName}요일`;
  };

  const getTime = (time) => {
    const newTime = new Date(time);
    const hours = newTime.getHours();
    const minutes = newTime.getMinutes();
    const period = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${period} ${formattedHours}:${formattedMinutes}`;
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
        {voice.location === "school" ? (
          <WithLocalSvg width={20} height={20} asset={School} />
        ) : (
          <WithLocalSvg width={20} height={20} asset={Hospital} />
        )}
        <Text style={styles.date}>{getDate(timestamp)}</Text>
        <Text style={styles.time}>{getTime(timestamp)}</Text>
      </View>
      <View style={styles.summaryBox}>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <WithLocalSvg width={20} height={20} asset={Note} />
          <Text style={styles.summaryTitle}>핵심 포인트만 정리했어요</Text>
        </View>
        <Text style={styles.summaryText}>{summaryText}</Text>
      </View>
      <ScrollView style={{ width: "100%" }}>
        <Text style={{ ...styles.text, paddingBottom: 20 }}>{text}</Text>
      </ScrollView>
      <VoiceModifyScreen
        visible={visible1}
        ipnumber={ipnumber}
        user_code={user_code}
        voice={voice}
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.line_gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 26,
    marginHorizontal: 20,
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
    height: 246,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  // 하루기록 -> 음성기록(이날 기록보기가 안뜸)
  modal3: {
    width: "100%",
    height: 194,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  button: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingHorizontal: 10,
    backgroundColor: theme.grey200,
  },
});
