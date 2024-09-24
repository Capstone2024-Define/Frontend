import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import * as AuthSession from "expo-auth-session";

const REST_API_KEY = "5757072cc0c10be2da7715dedd4429d8";
const REDIRECT_URI = "http://192.168.123.130:8081/Login";
// const REDIRECT_URI = AuthSession.makeRedirectUri({
//   useProxy: true, // Expo Proxy 사용
//   scheme: "clobit",
// });
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KakaoLoginWeb({ navigation }) {
  // 인증 코드
  const KakaoLoginWebView = (data) => {
    const exp = "code=";
    var condition = data.indexOf(exp);
    if (condition != -1) {
      var authorize_code = data.substring(condition + exp.length);
      console.log("authorize_code: ", authorize_code);
      requestToken(authorize_code);
    }
  };

  // 인증 토큰
  const requestToken = async (authorize_code) => {
    const tokenUrl = "https://kauth.kakao.com/oauth/token";
    const params = {
      grant_type: "authorization_code", // 올바른 grant_type
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: authorize_code,
    };

    var AccessToken = "none";
    axios({
      method: "post",
      url: tokenUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: new URLSearchParams(params).toString(), // POST 요청에 필요한 형식으로 변환
    })
      .then((response) => {
        const accessToken = response.data.access_token;
        console.log("AccessToken: ", accessToken);
        requestUserInfo(accessToken);
      })
      .catch((error) => {
        console.error("error: ", error.response ? error.response.data : error);
      });
  };

  // 유저 정보
  const requestUserInfo = (accessToken) => {
    axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        // response.date ex. {"connected_at": "2024-09-22T10:07:10Z", "id": 3715761500}
        console.log("유저 고유 ID: ", response.data.id);
        navigation.replace("StartInfo", { user_id: response.data.id }); // 다음페이지로 id 전달
      })
      .catch((error) => {
        console.error("error: ", error.response ? error.response.data : error);
      });
  };

  return (
    <View style={styles.container}>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={(event) => {
          KakaoLoginWebView(event.nativeEvent["url"]);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
