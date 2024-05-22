import React from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

// 하단 탭 내비게이터 생성
const Tab = createBottomTabNavigator();

// 임시 홈 화면
function HomeScreen({ navigation }) {
  return (
    <View style={{ paddingVertical: 200, paddingHorizontal: 30 }}>
      <Button
        title="상세기록"
        onPress={() => navigation.push("DetailRecord")}
      />
      <Button
        title="기록 전체보기"
        onPress={() => navigation.push("RecordHistory")}
      />
    </View>
  );
}

function InfoScreen() {
  return (
    <View>
      <Text>정보</Text>
    </View>
  );
}

function CalenderScreen() {
  return (
    <View>
      <Text>캘린더</Text>
    </View>
  );
}

function MyPageScreen() {
  return (
    <View>
      <Text>마이페이지</Text>
    </View>
  );
}

export default function MainPracticeScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      {/* 여기 HomeScreen만 언니가 만든 홈화면 이름으로 바꾸면 될듯? */}
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
        name="Calender"
        component={CalenderScreen}
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
