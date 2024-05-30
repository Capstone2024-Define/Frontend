import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VoiceHistoryScreen from "./VoiceHistoryScreen";
import { Ionicons } from "@expo/vector-icons";
import VoiceRecordScreen from "./VoiceRecordScreen";

// 하단 탭 내비게이터 생성
const Tab = createBottomTabNavigator();

export default function MainVoiceScreen({ route, navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="VoiceRecord"
      screenOptions={{
        tabBarLabelStyle: styles.tabBarText,
        tabBarIconStyle: { display: "none" }, // 아이콘을 숨기는 스타일
        tabBarActiveTintColor: "green",
        tabBarStyle: { paddingBottom: 15 },
      }}
    >
      <Tab.Screen
        name="VoiceRecord"
        component={VoiceRecordScreen}
        options={({ navigation }) => ({
          title: "새 녹음",
          headerShown: false,
        })}
      />
      <Tab.Screen
        name="VoiceHistory"
        component={VoiceHistoryScreen}
        options={({ navigation }) => ({
          title: "음성기록",
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarText: {
    fontSize: 15,
    fontWeight: "500",
  },
  headerTitleText: {
    fontSize: 17,
  },
});
