import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  Image,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import CalendarScreen from "./CalendarScreen";
import MyPageScreen from "./MyPageScreen";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import HomeGray from "../assets/home_gray.svg";
import InfoGray from "../assets/info_gray.svg";
import CalendarGray from "../assets/tabcalendar_gray.svg";
import MyGray from "../assets/mypage_gray.svg";
import HomeGreen from "../assets/home_gradient.svg";
import InfoGreen from "../assets/info_gradient.svg";
import CalendarGreen from "../assets/tabcalendar_gradient.svg";
import MyGreen from "../assets/mypage_gradient.svg";
// import ChatGray from "../assets/chat_gray.svg";
// import ChatGreen from "../assets/chat_gradient.svg";
// import ChatbotScreen from "./ChatBotScreen";
import InfoScreen from "./InfoScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const SvgIcon = ({ asset }) => (
  <WithLocalSvg width="25" height="25" asset={asset} />
);

export default function MainScreen() {
  let user_code = 1000;
  const ipnumber = "52.79.248.87";

  useState(() => {
    // user_code 가져오기
    const load = async () => {
      try {
        const value = await AsyncStorage.getItem("user_code");
        if (value !== null) {
          user_code = value;
        } else {
          console.log("user_code가 null입니다.");
        }
      } catch (error) {
        console.log("유저id 불러오기 실패");
      }
    };
    // load()
  }, []);

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
              // <SvgIcon asset={HomeGray} />
              <Image
                source={require("../assets/home_gray.png")}
                style={{ width: 19, resizeMode: "contain" }}
              />
            ),
        }}
        initialParams={{
          ipnumber: ipnumber,
          user_code: user_code,
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
        initialParams={{
          ipnumber: ipnumber,
          user_code: user_code,
        }}
      />
      {/* <Tab.Screen
        name="Chat"
        component={ChatbotScreen}
        options={{
          title: "챗봇",
          tabBarIcon: ({ color }) =>
            color === theme.green500 ? (
              <SvgIcon asset={ChatGreen} />
            ) : (
              <SvgIcon asset={ChatGray} />
            ),
        }}
        initialParams={{
          ipnumber: ipnumber,
          user_code: user_code,
        }}
      /> */}
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
        initialParams={{
          ipnumber: ipnumber,
          user_code: user_code,
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
        initialParams={{
          ipnumber: ipnumber,
          user_code: user_code,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 80,
    justifyContent: "space-between",
  },
  tabBarText: {
    fontSize: 12,
    fontFamily: "Pretendard-Medium",
    marginTop: 6,
  },
});
