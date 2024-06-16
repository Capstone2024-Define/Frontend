import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import summary from "./SummaryAPI";
import { getDetail, saveDetail } from "./ServerConnect";
import HomeScreen from "./HomeScreen";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import HomeGray from "../assets/home_gray.svg";
import InfoGray from "../assets/info_gray.svg";
import CalendarGray from "../assets/calendar_gray.svg";
import MyGray from "../assets/person_gray.svg";
import HomeGreen from "../assets/home_green.svg";
import InfoGreen from "../assets/info_green.svg";
import CalendarGreen from "../assets/calendar_green.svg";
import MyGreen from "../assets/person_green.svg";

const Tab = createBottomTabNavigator();

const SvgIcon = ({ asset }) => (
  <WithLocalSvg width="25" height="25" asset={asset} />
);

function InfoScreen() {
  // 서버 연결 테스트
  const [fetchedDetail, setFetchedDetail] = useState(null);

  const navigation = useNavigation();
  const date = new Date(2024, 6, 2);

  // 서버 연동 테스트
  const handleSaveDetail = () => {
    saveDetail({
      date: date,
      user_id: 1000,
      detail_home: "홈",
      detail_school: "학교",
      detail_hospital: "병원",
    });
  };

  const handleGetDetail = () => {
    getDetail({ date: date, user_id: 1000 }).then((data) =>
      setFetchedDetail(data)
    );
    console(fetchedDetail);
  };

  return (
    <View style={styles.defaultScreen}>
      <Text>정보</Text>
      <View style={{ marginTop: 30 }} />
      <Button
        title="Save User"
        onPress={handleSaveDetail}
        color={theme.grey150}
      />
      <Button
        title="Get User"
        onPress={handleGetDetail}
        color={theme.grey150}
      />
      {fetchedDetail && (
        <View>
          <Text>{fetchedDetail}</Text>
        </View>
      )}
    </View>
  );
}

function CalendarScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.defaultScreen}>
      <Text>캘린더</Text>
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
  tabBarText: {
    fontSize: 12,
    fontFamily: "Pretendard-Medium",
    marginTop: 6,
  },
});
