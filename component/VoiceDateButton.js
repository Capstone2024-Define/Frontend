import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";

export default function VoiceDateButton({ place, date, time, text, onPress }) {
  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={styles.voiceButton}
      >
        <View style={styles.voiceContent}>
          <View style={styles.voiceContentHeader}>
            <View style={{ flexDirection: "row" }}>
              {place === "school" ? (
                <WithLocalSvg width={20} height={20} asset={School} />
              ) : (
                <WithLocalSvg width={20} height={20} asset={Hospital} />
              )}
              <Text style={styles.date}>{date}</Text>
              <Text style={styles.time}>{time}</Text>
            </View>
            <Text style={styles.dubogi}>더보기</Text>
          </View>
          <Text style={styles.voiceText} numberOfLines={1} ellipsizeMode="tail">
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  voiceButton: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    height: 75,
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  voiceContent: { flex: 1, justifyContent: "center" },
  voiceContentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: theme.grey700,
    marginLeft: 8,
    marginRight: 8,
  },
  time: { fontSize: 14, fontFamily: "Pretendard-Medium", color: theme.grey500 },
  dubogi: { fontSize: 12, fontFamily: "Pretendard-Bold", color: theme.grey400 },
  voiceText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: theme.grey500,
  },
});
