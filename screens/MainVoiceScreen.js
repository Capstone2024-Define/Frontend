import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VoiceHistoryScreen from "./VoiceHistoryScreen";
import { Ionicons } from "@expo/vector-icons";
import VoiceRecordScreen from "./VoiceRecordScreen";
import { theme } from "../colors/color";

// 하단 탭 내비게이터 생성
const Tab = createBottomTabNavigator();

export default function MainVoiceScreen({ route, navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="VoiceRecord"
      screenOptions={{
        tabBarIconStyle: { display: "none" }, // 아이콘을 숨기는 스타일
        tabBarActiveTintColor: theme.green500, // 활성화 텍스트 색상
        tabBarInactiveTintColor: theme.grey300, // 비활성화 텍스트 색상
        tabBarStyle: { height: 47, paddingTop: 8, paddingBottom: 16 },
        tabBarLabelStyle: { fontSize: 14, fontFamily: "Pretendard-Medium" },
      }}
    >
      <Tab.Screen
        name="VoiceRecord"
        component={VoiceRecordScreen}
        options={({ navigation }) => ({
          title: "새녹음",
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="VoiceHistory"
        component={VoiceHistoryScreen}
        options={({ navigation }) => ({
          title: "목록",
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
