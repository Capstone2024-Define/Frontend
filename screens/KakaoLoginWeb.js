import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REST_API_KEY = "5757072cc0c10be2da7715dedd4429d8";
const REDIRECT_URI = "http://43.203.169.94:8080/Login";
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KakaoLoginWeb({ navigation, route }) {
  const [user_code, setUserCode] = useState(null);
  const [kakao_token, setKakaoToken] = useState("");
  const ipnumber = route.params.ipnumber;

  // 유저 코드 로드
  useEffect(() => {
    async function loadUserCode() {
      try {
        const savedUserCode = await AsyncStorage.getItem("user_code");
        setUserCode(savedUserCode);
        console.log("user_code: ", user_code);
      } catch (error) {
        console.log("user_code 로드 에러");
      }
    }
    loadUserCode();
  }, []);

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

    try {
      const response = await axios({
        method: "post",
        url: tokenUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: new URLSearchParams(params).toString(),
      });

      const accessToken = response.data.access_token;
      console.log("AccessToken: ", accessToken);
      setKakaoToken(accessToken);

      await requestUserInfo(accessToken);
    } catch (error) {
      console.log("토큰 가져오기 error: ", error);
    }
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
        // response.date ex. {"connected_at": "2024-09-22T10:07:10Z", "id": 371761500}
        console.log("유저 고유 ID: ", response.data.id);
        console.log("카카오 토큰: ", kakao_token);
        // save(response.data.id);
      })
      .catch((error) => {
        console.error("error: ", error.response ? error.response.data : error);
      });
  };

  const save = async (kakao_code) => {
    try {
      if (user_code) {
        console.log("재로그인 ", user_code);
        // 카카오 토큰만 PUT 구현 예정
        await AsyncStorage.setItem("state", "login"); // 상태 변경
        navigation.replace("Main", {
          ipnumber: ipnumber,
          user_code: user_code,
        });
      } else {
        console.log("첫가입");
        // 첫가입 => 유저 id, 카카오 토큰 POST
        const response = await axios.post(`http://${ipnumber}:8080/`, {
          kakao_code: kakao_code,
          kakao_token: kakao_token,
        });
        await AsyncStorage.setItem(
          "user_code",
          response.data.user_code.toString()
        );
        navigation.replace("StartInfo", {
          ipnumber: ipnumber,
          user_code: response.data.user_code,
        }); // 다음페이지로 id 전달
      }
    } catch (error) {
      console.log("유저 저장 에러 ", error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        style={{ flex: 1 }}
        // originWhitelist={["*"]}
        originWhitelist={["https://kauth.kakao.com"]}
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
