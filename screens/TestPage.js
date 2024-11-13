import { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import summarize from "./ChatgptAPI";
import AlarmModal from "../component/AlarmModal";

export default function TestPage({ route }) {
  const { ipnumber, user_code } = route.params;
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  // 카카오 연결끊기
  const logoutKakao = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://kapi.kakao.com/v1/user/unlink",
        headers: {
          Authorization: `Bearer JJL_SAwnGRt-IS2RsDz_FRURR14Ve0OEAAAAAQo9dGgAAAGS4SAv1aew61y3DOUZ`, // 본인 토큰
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

  const onClose = () => {
    setVisible(false);
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
            onPress={() => navigation.navigate("Splash")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>스플래시</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible(true)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>알림 모달</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AlarmModal visible={visible} onClose={onClose} />
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
