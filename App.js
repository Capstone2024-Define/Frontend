import React, { useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { toastConfig } from "./component/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";

// Screens
import DetailRecordScreen from "./screens/DetailRecordScreen";
import MainScreen from "./screens/MainScreen";
import DetailHistoryScreen from "./screens/DetailHistoryScreen";
import DetailModifyScreen from "./screens/DetailModifyScreen";
import MainVoiceScreen from "./screens/MainVoiceScreen";
import VoiceDetailScreen from "./screens/VoiceDetailScreen";
import VoiceModifyScreen from "./screens/VoiceModifyScreen";
import SymptomCheckScreen from "./screens/SymptomCheckScreen";
import SymptomInfoScreen from "./screens/SymptomInfoScreen";
import VoiceRecordScreen from "./screens/VoiceRecordScreen";
import SymptomResultScreen from "./screens/SymptomResultScreen";
import DetailNoneScreen from "./screens/DetailNoneScreen";
import SymptomCheckParent from "./screens/SymptomCheckParent";
import StartInfoScreen from "./screens/StartInfoScreen";
import ProfileModifyScreen from "./screens/ProfileModifyScreen";
import AlarmPage from "./screens/AlarmPage";
import AlarmSettingsPage from "./screens/AlarmSettingsPage";
import KakaoLoginScreen from "./screens/KakaoLoginScreen";
import KakaoLoginWeb from "./screens/KakaoLoginWeb";
import ExportRecordScreen from "./screens/ExportRecordScreen";
import CalendarScreen from "./screens/CalendarScreen";
import GraphScreen from "./screens/GraphScreen";
import TestPage from "./screens/TestPage";
import InfoScreen from "./screens/InfoScreen";
import InfoSearch from "./screens/InfoSearch";
import InfoSearchResult from "./screens/InfoSearchResult";
import InfoScreenDetail from "./screens/InfoScreenDetail";
import ChatbotScreen from "./screens/ChatBotScreen";
import SplashScreen from "./screens/SplashScreen";
import BookmarkScreen from "./screens/Bookmark";
import StartInfoScreen3 from "./screens/StartInfoScreen3";
import PreparingGuide from "./screens/PreparingGuide";
import PreparingInfo from "./screens/PreparingInfo"; // PreparingInfo 추가
import { CHATGPT_API_KEY, GOOGLE_API_KEY, KAKAOLOGIN_API_KEY } from "@env";
const Stack = createNativeStackNavigator();

export default function App() {
  const ipnumber = "13.125.108.157";
  // 확인
  console.log(
    "CHATGPT_API_KEY:",
    CHATGPT_API_KEY,
    " GOOGLE_API_KEY:",
    GOOGLE_API_KEY,
    " KAKAOLOGIN_API_KEY:",
    KAKAOLOGIN_API_KEY
  );

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
            initialRouteName="Splash"
            screenOptions={{
              animation: "fade",
            }}
          >
            <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
              initialParams={{
                ipnumber: ipnumber,
              }}
            />
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InfoScreen"
              component={InfoScreen}
              options={{ title: "정보 화면", headerShown: false }}
            />
            <Stack.Screen
              name="InfoSearch"
              component={InfoSearch}
              options={{ title: "검색 화면", headerShown: false }}
            />
            <Stack.Screen
              name="InfoSearchResult"
              component={InfoSearchResult}
              options={{ title: "검색 결과", headerShown: false }}
            />
            <Stack.Screen
              name="InfoScreenDetail"
              component={InfoScreenDetail}
              options={{ title: "정보 상세", headerShown: false }}
            />
            <Stack.Screen
              name="Bookmark"
              component={BookmarkScreen}
              options={{ title: "북마크한 정보", headerShown: false }}
            />
            <Stack.Screen
              name="PreparingGuide"
              component={PreparingGuide}
              options={{ title: "이용 가이드", headerShown: false }}
            />
            <Stack.Screen
              name="PreparingInfo" // 새로운 스크린 추가
              component={PreparingInfo}
              options={{ title: "앱 정보", headerShown: false }}
            />
            {/* 나머지 화면들 */}
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
              component={VoiceDetailScreen}
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
            <Stack.Screen
              name="KakaoLogin"
              component={KakaoLoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="KakaoLoginWeb"
              component={KakaoLoginWeb}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StartInfo"
              component={StartInfoScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StartInfo3"
              component={StartInfoScreen3}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProfileModify"
              component={ProfileModifyScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AlarmPage"
              component={AlarmPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AlarmSettingsPage"
              component={AlarmSettingsPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ExportRecord"
              component={ExportRecordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Calendar"
              component={CalendarScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Graph"
              component={GraphScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Test"
              component={TestPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chatbot"
              component={ChatbotScreen}
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
