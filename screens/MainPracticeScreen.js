import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(13); // 선택된 날짜 상태
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
      <View style={styles.calendar}>
        <Text style={styles.month}>2024년 6월</Text>
        <View style={styles.week}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
            <Text key={index} style={styles.day}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.days}>
          {[9, 10, 11, 12, 13, 14, 15].map((day) => (
            <View key={day} style={styles.dayContainer}>
              <TouchableOpacity onPress={() => setSelectedDate(day)}>
                <Text
                  style={[
                    styles.dayNumber,
                    selectedDate === day ? styles.selectedDay : null,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
              <Text style={styles.emoji}>{moods[day] ? moods[day] : "😐"}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.recordButton}
        onPress={() => {
          navigation.push("SymptomCheck");
        }}
      >
        <Text style={styles.recordTitle}>하루 기록</Text>
        <Text style={styles.recordText}>오늘 우리 아이를 기록해요</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.recordButton}
        onPress={() => navigation.push("MainVoice")}
      >
        <Text style={styles.recordTitle}>음성기록</Text>
        <Text style={styles.recordText}>음성을 텍스트로 변환</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function InfoScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.defaultScreen}>
      <Button
        title="기록보기"
        onPress={() => navigation.push("RecordHistory")}
      />
    </View>
  );
}

function CalendarScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.defaultScreen}>
      <Button
        title="갤러리 테스트"
        onPress={() => navigation.navigate("GalleryTest")}
      />
    </View>
  );
}

function MyPageScreen() {
  return (
    <View style={styles.defaultScreen}>
      <Text>마이페이지</Text>
    </View>
  );
}

export default function MainPracticeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 55,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "green",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          title: "정보",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: "캘린더",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          title: "마이",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="solution1" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
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
});
