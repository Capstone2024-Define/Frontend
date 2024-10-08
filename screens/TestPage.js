import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import summarize from "./ChatgptAPI";

export default function TestPage() {
  // GET
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  // GET 요청 형식
  // const response = await axios.get(
  //   `http://192.168.123.159:8080/daily/records/${user_id}/${date}`
  // );
  useEffect(() => {
    // GET 요청

    console.log("GET 요청 시작");
    axios
      .get("http://192.168.123.159:8080/daily/records/1000/2024-09-30")
      .then((response) => {
        console.log("GET 성공적");
        setData(response.data);
      })
      .catch((error) => {
        console.log("Get 에러: ", error);
        setError(error);
      });
  }, []);

  // POST 요청 핸들러
  const handlePost = () => {
    axios
      .post("http://192.168.123.159:8080/daily/post", {
        user_code: 1000,
        date: "2024-08-20",
        home: "9월 24일 home 테스트",
        school: "9월 24일 school 테스트",
        hospital: "9월 24일 hospital 테스트",
        summary: "으아아아아악",
        state: 2,
      })
      .then((response) => {
        console.log("Post 응답:", response.data);
      })
      .catch((error) => {
        console.error("Post error:", error);
      });
  };

  // 카카오 연결끊기
  const logoutKakao = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://kapi.kakao.com/v1/user/unlink",
        headers: {
          Authorization: `Bearer ELC5V3f78_lTQ0sUpFxwf5npWasjcLR8AAAAAQoqJQ0AAAGSS_-gHaew61y3DOUZ`, // 본인 토큰
        },
      });
      console.log("로그아웃 성공: ", response.data);
      await AsyncStorage.removeItem("user_id"); // 저장된 사용자 정보 삭제
    } catch (error) {
      console.error(
        "로그아웃 실패: ",
        error.response ? error.response.data : error
      );
    }
  };

  const getSummary = async () => {
    const response = await summarize(
      "어제 저녁, 아들과 함께 저녁 식사를 하면서 그는 학교에서의 하루를 나누었어요. 친구들과의 시간을 즐겁게 보냈다며 웃으면서 이야기를 했습니다. 하지만 수업 시간에는 집중이 잘 되지 않았다고 솔직히 언급했어요. 집에 돌아와서는 숙제를 시작했을 때, 아들은 집중력을 높이기 위해 시간을 조정하는 데 애를 썼지만, 중간에는 간혹 짜증을 내기도 했습니다. 저녁 식사 중에 아들은 미안하다며 사과를 하면서 저와 대화를 나누었고, 함께 그날의 일을 돌아보며 더 나은 방법을 찾기로 했습니다."
    );
    console.log(response); // 응답 내용 출력
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        left={"leftArrow"}
        title={"테스트 페이지"}
        onLeftPress={() => navigation.pop()}
      />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View
          style={{
            flex: 2,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push("StartInfo", { user_id: 1 })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>시작 정보 입력</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push("AlarmPage")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>알림 페이지</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push("KakaoLogin")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>카카오 로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={logoutKakao}
            style={styles.button}
          >
            <Text style={styles.buttonText}>카카오 로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={getSummary}
            style={styles.button}
          >
            <Text style={styles.buttonText}>챗지피티 요약</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={handlePost}
            style={styles.button}
          >
            <Text style={styles.buttonText}>POST 요청 테스트</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1.5, paddingVertical: 20 }}>
          {error && (
            <Text style={{ ...styles.s_text, marginBottom: 4 }}>
              Error: {error.message}
            </Text>
          )}
          {data && (
            <Text style={styles.s_text}>
              GET{"\n"}
              {JSON.stringify(data)}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 320,
    height: 56,
    marginVertical: 2,
    backgroundColor: theme.grey150,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.grey300,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: "Pretendard-Medium",
  },
  s_text: {
    fontSize: 12,
    lineHeight: 20,
    color: theme.grey600,
  },
});
