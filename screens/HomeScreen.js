import React, { useEffect, useState } from "react";
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
  ScrollView,
} from "react-native";
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import HomeDayButton from "../component/HomeDayButton";
import HomeVoiceButton from "../component/HomeVoiceButton";
import { theme } from "../colors/color";

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

  useEffect(() => {
    const date = cvtDateString(new Date());
    setSelectedDate(date);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      getWeeks(selectedDate);
    }
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

  const [moods, setMoods] = useState({});

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
      <ImageBackground
        source={require("../assets/background.png")} 
        style={styles.backgroundImage}
      >
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 12,
              marginHorizontal: 30,
            }}
          >
            <View style={{ flex: 1, marginTop: 68, marginRight: 4 }}>
              <Text
                style={{ color: "#FFFFFF", fontSize: 16, marginBottom: 11 }}
              >
                {"오늘도 같이 기록해볼까요?"}
              </Text>
              <Text style={{ color: "#FFFFFF" }}>{"12일째 기록하는 중"}</Text>
            </View>
            <Image
             source={require("../assets/rabbit.png")}
              resizeMode={"stretch"}
              style={{ width: 72, height: 122 }}
            />
          </View>
          <View
            style={{
              backgroundColor: "#FEFCF4",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 24,
              paddingBottom: 14,
              paddingHorizontal: 24,
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
                <Feather name="calendar" size={16} color="gray" />
              </TouchableOpacity>
              <Text style={{ color: "#555555", fontSize: 14 }}>
                {`${new Date(selectedDate).getFullYear()}년 ${
                  new Date(selectedDate).getMonth() + 1
                }월 ${getWeekNumber(selectedDate)}주차`}
              </Text>
              <View style={{ flex: 1, alignSelf: "stretch" }}></View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                paddingVertical: 8,
                marginBottom: 16,
              }}
            >
              {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
                <View
                  key={index}
                  style={{
                    width: 39,
                    backgroundColor:
                      selectedDate === weeks[index]
                        ? "#78BA7D"
                        : "transparent",
                    borderRadius: 24,
                    paddingVertical: 9,
                    paddingHorizontal: 12,
                    marginRight: index === 6 ? 0 : 16,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedDate === weeks[index]
                          ? "#FFFFFF"
                          : "#242424",
                      fontSize: 12,
                      marginBottom: 7,
                      textAlign: "center",
                    }}
                  >
                    {day}
                  </Text>
                  <Text
                    style={{
                      color:
                        selectedDate === weeks[index]
                          ? "#FFFFFF"
                          : "#242424",
                      fontSize: 12,
                      marginBottom: 7,
                      textAlign: "center",
                    }}
                  >
                    {new Date(weeks[index]).getDate()}
                  </Text>
                </View>
              ))}
            </View>
            <View
              style={{
                backgroundColor: "#FBFBFB",
                borderRadius: 8,
                paddingTop: 15,
                paddingBottom: 37,
                marginBottom: 36,
              }}
            >
              <Text
                style={{
                  color: "#333333",
                  fontSize: 14,
                  marginBottom: 108,
                  marginLeft: 17,
                }}
              >
                {`${new Date(selectedDate).getMonth() + 1}.${new Date(
                  selectedDate
                ).getDate()} ${["일", "월", "화", "수", "목", "금", "토"][
                  new Date(selectedDate).getDay()
                ]}요일 (오늘)`}
              </Text>
              <View style={{ alignItems: "center" }}>
                <Image
                     source={require("../assets/rabbit.png")}
                  resizeMode={"stretch"}
                  style={{ width: 40, height: 40 }}
                />
                <Text
                  style={{
                    color: "#6F6F6F",
                    fontSize: 14,
                    marginTop: 5,
                  }}
                >
                  {"작성된 기록이 없어요"}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  width: 177,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#78BA7D",
                  borderRadius: 24,
                  paddingVertical: 13,
                }}
                onPress={() => navigation.push("SymptomCheck")}
              >
                <FontAwesome name="pencil" size={24} color="white" />
                <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
                  {"하루기록"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 118,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F5DE8F",
                  borderRadius: 24,
                  paddingVertical: 13,
                }}
                onPress={() => navigation.push("MainVoice")}
              >
                <FontAwesome name="microphone" size={24} color="white" />
                <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
                  {"음성기록"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
  },
  recordTitle: {
    fontSize: 16,
    marginBottom: 10,
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#66BB6A",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  audioButton: {
    backgroundColor: "#FFCA28",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
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
