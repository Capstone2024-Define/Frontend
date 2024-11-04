import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VoiceHistoryScreen from "./VoiceHistoryScreen";
import { Ionicons } from "@expo/vector-icons";
import VoiceRecordScreen from "./VoiceRecordScreen";
import { theme } from "../colors/color";

// 하단 탭 내비게이터 생성
const Tab = createBottomTabNavigator();

export default function MainVoiceScreen({ route, navigation }) {
  const { user_code, ipnumber, date } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="VoiceRecord"
      screenOptions={({ route }) => ({
        tabBarIconStyle: { display: "none" },
        tabBarActiveTintColor: theme.green500,
        tabBarInactiveTintColor: theme.grey300,
        tabBarStyle: { height: 47, paddingBottom: 15 },
        tabBarLabelStyle: { fontSize: 14, fontFamily: "Pretendard-Medium" },
        tabBarLabel: ({ focused }) => (
          <View style={styles.tabLabelContainer}>
            {focused && <View style={styles.seletedline} />}
            <Text
              style={[
                styles.tabLabel,
                focused && {
                  fontFamily: "Pretendard-Bold",
                  color: theme.green500,
                },
              ]}
            >
              {route.name === "VoiceRecord" ? "새녹음" : "목록"}
            </Text>
          </View>
        ),
      })}
    >
      <Tab.Screen
        name="VoiceRecord"
        component={VoiceRecordScreen}
        options={({ navigation }) => ({
          title: "새녹음",
          headerShown: false,
        })}
        initialParams={{
          date: date,
          user_code: user_code,
          ipnumber: ipnumber,
        }}
      />
      <Tab.Screen
        name="VoiceHistory"
        component={VoiceHistoryScreen}
        options={({ navigation }) => ({
          title: "목록",
          headerShown: false,
        })}
        initialParams={{
          user_code: user_code,
          ipnumber: ipnumber,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabLabelContainer: {
    alignItems: "center",
  },
  seletedline: {
    width: 58,
    height: 4,
    backgroundColor: theme.green500,
    borderRadius: 8,
    marginBottom: 8,
  },
  tabLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey300,
  },
});
