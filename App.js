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
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailRecordScreen from "./screens/DetailRecordScreen";
import MainPracticeScreen from "./screens/MainPracticeScreen";
import DoneRecord from "./screens/DoneRecord";
import RecordHistory from "./screens/RecordHistory";
import RecordModify from "./screens/RecordModify";
import { Ionicons } from "@expo/vector-icons";
import Toast, { ToastConfig } from "react-native-toast-message";
import { showToast, toastConfig } from "./component/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import MainVoiceScreen from "./screens/MainVoiceScreen";
import DetailVoiceScreen from "./screens/DetailVoiceScreen";
import VoiceModifyScreen from "./screens/VoiceModifyScreen";

// 스택 내비게이터 생성
const Stack = createNativeStackNavigator();

// 상세기록 헤더 정의
const DetailRecordHeaderLeft = (navigation) => (
  <TouchableOpacity
    style={{ paddingLeft: 10 }}
    onPress={() => navigation.pop()}
  >
    <Text style={styles.headerLRText}>이전</Text>
  </TouchableOpacity>
);
const DetailRecordHeaderRight = (navigation) => (
  <TouchableOpacity
    style={{ paddingRight: 10 }}
    onPress={() => navigation.push("DoneRecord")}
  >
    <Text style={styles.headerLRText}>다음</Text>
  </TouchableOpacity>
);

// 기록보기 헤더정의
const RecordHistoryHeaderLeft = (navigation) => (
  <TouchableOpacity style={{ paddingLeft: 7 }} onPress={() => navigation.pop()}>
    <Ionicons name="chevron-back" size={22} color="grey" />
  </TouchableOpacity>
);
const RecordHistoryHeaderRight = (navigation) => (
  <TouchableOpacity
    style={{ paddingRight: 10 }}
    onPress={() => navigation.push("RecordModify")}
  >
    <Text style={styles.headerLRText}>수정하기</Text>
  </TouchableOpacity>
);

// 수정하기 헤더 정의
const RecordModifyHeaderLeft = (navigation) => (
  <TouchableOpacity
    style={{ paddingLeft: 10 }}
    onPress={() => navigation.pop()}
  >
    <Text style={styles.headerLRText}>취소</Text>
  </TouchableOpacity>
);
const RecordModifyHeaderRight = () => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate("RecordHistory");
    showToast("수정이 완료되었습니다.");
  };

  return (
    <TouchableOpacity style={{ paddingRight: 10 }} onPress={onPress}>
      <Text style={styles.headerLRText}>완료</Text>
    </TouchableOpacity>
  );
};

// 보이스 헤더정의
const VoiceHeaderLeft = (navigation) => (
  <TouchableOpacity
    style={{ paddingLeft: 7 }}
    onPress={() => navigation.popToTop()}
  >
    <Ionicons name="chevron-back" size={22} color="grey" />
  </TouchableOpacity>
);

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
              headerShadowVisible: false,
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
              name="DetailRecord"
              component={DetailRecordScreen}
              options={({ navigation }) => ({
                title: "상세기록",
                headerBackVisible: false,
                headerStyle: styles.header,
                headerTitleAlign: "center",
                headerLeft: () => DetailRecordHeaderLeft(navigation),
                headerTitle: ({ children }) => (
                  <View>
                    <Text style={styles.headerTitleText}>{children}</Text>
                  </View>
                ),
                headerRight: () => DetailRecordHeaderRight(navigation),
              })}
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
              options={({ navigation }) => ({
                title: "0월 0일 기록",
                headerBackVisible: false,
                headerStyle: styles.header,
                headerTitleAlign: "center",
                headerLeft: () => RecordHistoryHeaderLeft(navigation),
                headerTitle: ({ children }) => (
                  <View>
                    <Text style={styles.headerTitleText}>{children}</Text>
                  </View>
                ),
                headerRight: () => RecordHistoryHeaderRight(navigation),
              })}
            />
            <Stack.Screen
              name="RecordModify"
              component={RecordModify}
              options={({ navigation }) => ({
                title: "수정하기",
                headerBackVisible: false,
                headerStyle: styles.header,
                headerTitleAlign: "center",
                headerLeft: () => RecordModifyHeaderLeft(navigation),
                headerTitle: ({ children }) => (
                  <View>
                    <Text style={styles.headerTitleText}>{children}</Text>
                  </View>
                ),
                headerRight: () => RecordModifyHeaderRight(),
              })}
            />
            <Stack.Screen
              name="MainVoice"
              component={MainVoiceScreen}
              options={{
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
