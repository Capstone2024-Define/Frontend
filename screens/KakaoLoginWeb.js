import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KAKAOLOGIN_API_KEY } from "@env";

const INJECTED_JAVASCRIPT = `
  (function() {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(document.body.innerText);
    }
  })();
  true;
`;

export default function KakaoLoginWeb({ navigation, route }) {
  const [currentState, setCurrentState] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
  const [isWebViewVisible, setIsWebViewVisible] = useState(true);
  const ipnumber = route.params.ipnumber;
  const REDIRECT_URI = `http://${ipnumber}:8080/Login`;

  useEffect(() => {
    async function stateLoad() {
      try {
        const response = await AsyncStorage.getItem("state");
        console.log("현재 상태: ", response);
        setCurrentState(response);
      } catch (error) {
        console.log("state 로드 에러: ", error);
      }
    }
    stateLoad();
  }, []);

  useEffect(() => {
    async function login() {
      if (serverResponse?.status === "OK") {
        console.log("로그인 성공", serverResponse.userId);
        setIsWebViewVisible(false);

        const response_exist_user_code = await axios.get(
          `http://${ipnumber}:8080/exist?user_code=${serverResponse.userId}`
        );
        console.log(response_exist_user_code.data);
        if (currentState === "first") {
          try {
            await AsyncStorage.setItem("user_code", serverResponse.userId);
            if (response_exist_user_code.data == 0) {
              console.log("첫 로그인");
              navigation.replace("StartInfo", {
                ipnumber: ipnumber,
                user_code: serverResponse.userId,
              });
            } else {
              console.log("재로그인");
              await AsyncStorage.setItem("state", "login");
              navigation.replace("Main", {
                ipnumber: ipnumber,
                user_code: serverResponse.userId,
              });
            }
          } catch (error) {
            console.log("유저코드 저장 에러: ", error);
          }
        } else {
          console.log("재로그인");
          try {
            await AsyncStorage.setItem("state", "login");
          } catch (error) {
            console.log("state 갱신 에러: ", error);
          }
          navigation.replace("StartInfo", {
            ipnumber: ipnumber,
            user_code: serverResponse.userId,
          });
        }
      }
    }
    login();
  }, [serverResponse]);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setServerResponse(data);
    } catch (error) {
      console.log("응답 파싱 오류:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isWebViewVisible ? (
        <WebView
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          source={{
            uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAOLOGIN_API_KEY}&redirect_uri=${REDIRECT_URI}`,
          }}
          cacheEnabled={false}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          javaScriptEnabled
          onMessage={handleMessage}
        />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" /> // 로딩 표시
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
