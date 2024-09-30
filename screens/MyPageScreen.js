import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Notice from "../assets/notice.svg";
import Docs from "../assets/forward_to_inbox.svg";
import Bookmark from "../assets/bookmark.svg";

export default function MyPageScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={{ ...styles.m_text, color: theme.grey500 }}>
          안녕하세요!
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 33,
          }}
        >
          <Text style={{ ...styles.L_text, marginTop: 4 }}>디파인님</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push("ProfileModify")}
            style={styles.button}
          >
            <Text style={styles.ss_text}>프로필수정</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <WithLocalSvg asset={Bookmark} />
            <Text style={styles.s_text}>북마크한 정보</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.push("ExportRecord")}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <WithLocalSvg asset={Docs} />
            <Text style={styles.s_text}>기록 내보내기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => navigation.push("AlarmPage")} // 알림 설정 페이지로 이동
          >
            <WithLocalSvg asset={Notice} />
            <Text style={styles.s_text}>알림 설정하기</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.subContainer}>
        <TouchableOpacity activeOpacity={0.5}>
          <Text
            style={{ ...styles.m_text, color: theme.grey800, marginBottom: 11 }}
          >
            계정관리
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <Text
            style={{ ...styles.m_text, color: theme.grey800, marginBottom: 11 }}
          >
            이용 가이드
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <Text
            style={{ ...styles.m_text, color: theme.grey800, marginBottom: 11 }}
          >
            앱 정보
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            console.log("test");
            navigation.push("Test");
          }}
        >
          <Text
            style={{ ...styles.m_text, color: theme.grey250, marginBottom: 11 }}
          >
            TEST 페이지
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    paddingHorizontal: 20,
    paddingVertical: 33,
  },
  L_text: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Pretendard-Bold",
    color: theme.grey800,
  },
  m_text: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Regular",
  },
  s_text: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  ss_text: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey400,
  },
  button: {
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 50,
    backgroundColor: theme.grey150,
  },
  line: {
    width: "100%",
    height: 8,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#ECECEC",
  },
});
