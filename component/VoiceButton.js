import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Voice from "../assets/graphic_eq.svg";

export default function VoiceButton({ time, text, onPress }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View style={styles.voiceButton}>
          <View style={styles.voiceContent}>
            <View style={styles.voiceContentHeader}>
              <View style={{ flexDirection: "row" }}>
                <WithLocalSvg width={18} height={18} asset={Voice} />
                <Text style={styles.voiceTime}>{time}</Text>
              </View>
              <Text style={styles.dubogi}>더보기</Text>
            </View>
            <Text style={styles.voiceText}>{text}...</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

VoiceButton.defaultProps = {
  time: "오후 4:50",
  text: "안녕하세요, 선생님. 우리 아이 학교 생활은 잘하고 있는",
};

const styles = StyleSheet.create({
  voiceButton: {
    flexDirection: "row",
    width: 312,
    height: 68,
    borderRadius: 16,
    backgroundColor: theme.grey50,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  voiceContent: { flex: 1 },
  voiceContentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  image: { width: 18, height: 18, marginRight: 9 },
  voiceTime: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: theme.grey700,
  },
  dubogi: {
    fontSize: 12,
    //fontWeight: "700",
    fontFamily: "Pretendard-Bold",
    color: theme.grey400,
  },
  voiceText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: theme.grey500,
  },
});
