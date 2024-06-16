import React, { useEffect } from "react";
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
import MainScreen from "./screens/MainScreen";
import DetailHistoryScreen from "./screens/DetailHistoryScreen";
import DetailModifyScreen from "./screens/DetailModifyScreen";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { toastConfig } from "./component/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import MainVoiceScreen from "./screens/MainVoiceScreen";
import DetailVoiceScreen from "./screens/DetailVoiceScreen";
import VoiceModifyScreen from "./screens/VoiceModifyScreen";
import SymptomCheckScreen from "./screens/SymptomCheckScreen";
import SymptomInfoScreen from "./screens/SymptomInfoScreen";
import VoiceRecordScreen from "./screens/VoiceRecordScreen";
import SymptomResultScreen from "./screens/SymptomResultScreen";
import DetailNoneScreen from "./screens/DetailNoneScreen";
import { useFonts } from "expo-font"; // 폰트 관련
import SymptomCheckParent from "./screens/SymptomCheckParent";
// import VoiceTestScreen from "./screens/VoiceTestScreen";

// 스택 내비게이터 생성
const Stack = createNativeStackNavigator();

export default function App() {
  // 폰트 - 엑스포 방법
  // Medium -> 500
  const [fontsLoaded] = useFonts({
    "Human-beomseok": require("./assets/fonts/Human-beomseok.ttf"),
    "Pretendard-Bold": require("./assets/fonts/Pretendard-Bold.ttf"),
    "Pretendard-Medium": require("./assets/fonts/Pretendard-Medium.ttf"),
    "Pretendard-Regular": require("./assets/fonts/Pretendard-Regular.ttf"),
  });
  if (!fontsLoaded) return null;

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
              component={MainScreen}
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
              name="SymptomCheckParent"
              component={SymptomCheckParent}
              options={{
                title: "되돌아보기",
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
              name="DetailHistory"
              component={DetailHistoryScreen}
              options={{
                title: "0월 0일 기록",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="DetailModify"
              component={DetailModifyScreen}
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
              options={{ headerShown: false, animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="VoiceModify"
              component={VoiceModifyScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SymptomInfo"
              component={SymptomInfoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VoiceRecord"
              component={VoiceRecordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DetailNone"
              component={DetailNoneScreen}
              options={{ headerShown: false }}
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
});
