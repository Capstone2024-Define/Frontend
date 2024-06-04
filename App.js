import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailRecordScreen from "./screens/DetailRecordScreen";
import MainPracticeScreen from "./screens/MainPracticeScreen";
import DoneRecord from "./screens/DoneRecord";
import RecordHistory from "./screens/RecordHistory";
import RecordModify from "./screens/RecordModify";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { toastConfig } from "./component/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import MainVoiceScreen from "./screens/MainVoiceScreen";
import DetailVoiceScreen from "./screens/DetailVoiceScreen";
import VoiceModifyScreen from "./screens/VoiceModifyScreen";
import SymptomCheckScreen from "./screens/SymptomCheckScreen";
import SymptomInfoScreen from "./screens/SymptomInfoScreen";
import GalleryTest from "./screens/GalleryTest";
import VoiceRecordScreen from "./screens/VoiceRecordScreen"; // 추가된 부분
import SymptomResultScreen from "./screens/SymptomResultScreen";

// 스택 내비게이터 생성
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding" })}
        style={styles.avoid}
      />
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              animation: "fade",
            }}
          >
            {/* 내비게이터로 이동할 화면들 추가 */}
            <Stack.Screen
              name="Main"
              component={MainPracticeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SymptomCheck"
              component={SymptomCheckScreen}
              options={{
                title: "증상체크",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SymptomResult"
              component={SymptomResultScreen}
              options={{
                title: "측정 결과",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="DetailRecord"
              component={DetailRecordScreen}
              options={{
                title: "상세기록",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="DoneRecord"
              component={DoneRecord}
              options={{
                title: "기록완료",
                headerBackVisible: false,
                headerTitleAlign: "center",
                headerTitle: ({ children }) => (
                  <View>
                    <Text style={styles.headerTitleText}>{children}</Text>
                  </View>
                ),
              }}
            />
            <Stack.Screen
              name="RecordHistory"
              component={RecordHistory}
              options={{
                title: "0월 0일 기록",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="RecordModify"
              component={RecordModify}
              options={{
                title: "수정하기",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MainVoice"
              component={MainVoiceScreen}
              options={{
                title: "음성기록",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="DetailVoice"
              component={DetailVoiceScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VoiceModify"
              component={VoiceModifyScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="GalleryTest" component={GalleryTest} />
            <Stack.Screen
              name="SymptomInfo"
              component={SymptomInfoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VoiceRecord" // 추가된 부분
              component={VoiceRecordScreen} // 추가된 부분
              options={{ headerShown: false }} // 추가된 부분
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: 17,
  },
  headerLRText: {
    color: "grey",
  },
});
