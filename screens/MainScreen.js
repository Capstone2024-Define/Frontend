import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import CalendarScreen from "./CalendarScreen";
import MyPageScreen from "./MyPageScreen";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import HomeGray from "../assets/home_gray.svg";
import InfoGray from "../assets/info_gray.svg";
import CalendarGray from "../assets/calendar_gray.svg";
import MyGray from "../assets/person_gray.svg";
import HomeGreen from "../assets/home_gradient.svg";
import InfoGreen from "../assets/info_gradient.svg";
import CalendarGreen from "../assets/calendar_gradient.svg";
import MyGreen from "../assets/my_gradient.svg";
import ChatGray from "../assets/chat_gray.svg";
import ChatGreen from "../assets/chat_gradient.svg";
import axios from "axios";

const Tab = createBottomTabNavigator();

const SvgIcon = ({ asset }) => (
  <WithLocalSvg width="25" height="25" asset={asset} />
);

function InfoScreen() {
  // GET
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    // GET 요청
    axios
      .get("http://192.168.64.1:8080/api/detail/alldetail")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Get 에러: ", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // POST 요청 핸들러
  const handlePost = () => {
    axios
      .post("http://192.168.64.1:8080/api/detail", {
        date: "2024-07-22",
        userCode: 1001,
        detail_home: "home test",
        detail_school: "school test",
        detail_hospital: "hospital test",
      })
      .then((response) => {
        console.log("Post 응답:", response.data);
      })
      .catch((error) => {
        console.error("Post 에러:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Button title="정보입력" onPress={() => navigation.push("StartInfo")} />
      <Button title="Send POST request" onPress={handlePost} />
      {error && <Text>Error: {error.message}</Text>}
      {data && <Text>Data: {JSON.stringify(data)}</Text>}
    </View>
  );
}

function ChatScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.defaultScreen}>
      <Text>챗봇페이지</Text>
    </View>
  );
}

export default function MainScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 67,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 12,
          paddingTop: 8,
          paddingHorizontal: 10,
        },
        tabBarActiveTintColor: theme.green500,
        tabBarInactiveTintColor: theme.grey250,
        tabBarLabelStyle: styles.tabBarText,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "홈",
          tabBarIcon: ({ color }) =>
            color === theme.green500 ? (
              <SvgIcon asset={HomeGreen} />
            ) : (
              <SvgIcon asset={HomeGray} />
            ),
        }}
      />
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          title: "정보",
          tabBarIcon: ({ color }) =>
            color === theme.green500 ? (
              <SvgIcon asset={InfoGreen} />
            ) : (
              <SvgIcon asset={InfoGray} />
            ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: "챗봇",
          tabBarIcon: ({ color }) =>
            color === theme.green500 ? (
              <SvgIcon asset={ChatGreen} />
            ) : (
              <SvgIcon asset={ChatGray} />
            ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: "캘린더",
          tabBarIcon: ({ color }) =>
            color === theme.green500 ? (
              <SvgIcon asset={CalendarGreen} />
            ) : (
              <SvgIcon asset={CalendarGray} />
            ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          title: "마이",
          tabBarIcon: ({ color }) =>
            color === theme.green500 ? (
              <SvgIcon asset={MyGreen} />
            ) : (
              <SvgIcon asset={MyGray} />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    justifyContent: "space-between",
  },
  tabBarText: {
    fontSize: 12,
    fontFamily: "Pretendard-Medium",
    marginTop: 6,
  },
});
