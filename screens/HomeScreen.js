import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";

import HomeDayButton from "../component/HomeDayButton";
import HomeVoiceButton from "../component/HomeVoiceButton";
import { Feather } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { theme } from "../colors/color";
import { Ionicons } from "@expo/vector-icons";

// 화면 크기 가져오기
const SCREEN_HEIGHT = Dimensions.get("window").height;

// 캘린더 모달창
const CalenderModal = ({ visible, onClose, selectedDate, setSelectedDate }) => {
  // 어두운 배경 눌러도 모달창 닫히게 Pressable
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
  // 모달창 visible
  const [modalVisible, setModalVisible] = useState(false);
  // 선택된 날짜(String형)
  const [selectedDate, setSelectedDate] = useState("");
  // 선택된 날짜 주간
  const [weeks, setWeeks] = useState([]);

  // 시작 시 selectedDate 초기화
  useEffect(() => {
    const date = cvtDateString(new Date());
    setSelectedDate(date);
  }, []);

  // 선택된 날짜에 맞게 주간 변경
  useEffect(() => {
    if (selectedDate) {
      getWeeks(selectedDate);
    }
    console.log(selectedDate);
  }, [selectedDate]);

  // Date형 날짜 -> String형 날짜
  const cvtDateString = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 선택 날짜 주간 날짜 가져오는 함수
  const getWeeks = (date) => {
    const startDate = new Date(date);
    const dayOfWeek = startDate.getDay(); // 0 (일) to 6 (토)

    // 시작일 계산
    startDate.setDate(startDate.getDate() - dayOfWeek);

    // 주간 배열 초기화
    const newWeeks = [];
    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(startDate);
      tempDate.setDate(startDate.getDate() + i);
      newWeeks.push(cvtDateString(tempDate));
    }
    setWeeks(newWeeks);
  };

  // 선택 날짜가 몇주차인지 계산
  const getWeekNumber = (date) => {
    const dateFrom = new Date(date);
    const currentDate = dateFrom.getDate(); // 해당 날짜(일)
    const startOfMonth = new Date(dateFrom.setDate(1)); // 이번달 1일
    const weekDay = startOfMonth.getDay(); // 이번달 1일 요일, 0 (일) to 6 (토)

    // ((요일 - 1) + 해당 날짜) / 7일로 나누기 = N 주차
    return parseInt((weekDay - 1 + currentDate) / 7) + 1;
  };

  const [moods, setMoods] = useState({}); // 날짜별 이모지 상태

  const renderEmoji = (emoji, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => setMoods({ ...moods, [selectedDate]: emoji })}
    >
      <Text
        style={[
          styles.emoji,
          moods[selectedDate] === emoji ? styles.selectedEmoji : null,
        ]}
      >
        {emoji}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>오늘 우리 아이가 어땠는지 기록해주세요</Text>
      <View style={styles.calenderHeader}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setModalVisible(true)}
        >
          <Feather name="calendar" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.month}>
          {new Date(selectedDate).getFullYear()}년{" "}
          {new Date(selectedDate).getMonth() + 1}월{" "}
          {getWeekNumber(selectedDate)}주차
        </Text>
        <TouchableOpacity
          onPress={() => {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() - 1);
            setSelectedDate(cvtDateString(date));
          }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.grey800} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() + 1);
            setSelectedDate(cvtDateString(date));
          }}
        >
          <Ionicons name="chevron-forward" size={24} color={theme.grey800} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        <View style={styles.week}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <Text key={index} style={styles.day}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.days}>
          {weeks.map((day) => (
            <View key={day} style={styles.dayContainer}>
              <TouchableOpacity onPress={() => setSelectedDate(day)}>
                <Text
                  style={[
                    styles.dayNumber,
                    selectedDate === day ? styles.selectedDay : null,
                  ]}
                >
                  {new Date(day).getDate()}
                </Text>
              </TouchableOpacity>
              <Text style={styles.emoji}>{moods[day] ? moods[day] : "😐"}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.buttonView}>
        <HomeDayButton
          text="하루기록"
          onPress={() => {
            navigation.push("SymptomCheck");
          }}
        />
        <HomeVoiceButton
          text="음성기록"
          onPress={() => navigation.push("MainVoice")}
        />
      </View>
      <CalenderModal
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
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  calenderHeader: {
    flexDirection: "row",
    padding: 20,
  },
  calendar: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  month: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  week: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  day: {
    fontSize: 14,
    fontWeight: "bold",
  },
  days: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  dayContainer: {
    alignItems: "center",
  },
  dayNumber: {
    width: 30,
    height: 30,
    textAlign: "center",
    lineHeight: 30,
    borderRadius: 15,
    marginVertical: 5,
  },
  selectedDay: {
    backgroundColor: "#ccc",
  },
  emoji: {
    fontSize: 30,
  },
  selectedEmoji: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 15,
    padding: 5,
  },
  recordButton: {
    backgroundColor: "#e0e0e0",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  recordTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recordText: {
    color: "#000",
    fontSize: 14,
  },
  defaultScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
