import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";
import { theme } from "../colors/color";

export default function VoiceTimeButton({ place, date, time, text, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View style={styles.voiceButton}>
        <View style={styles.place}>
          <Text style={styles.placeText}>{place}</Text>
        </View>
        <View style={styles.voiceContent}>
          <View style={styles.voiceContentHeader}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.date}>{date}</Text>
              <Text style={styles.time}>{time}</Text>
            </View>
            <Text style={styles.dubogi}>더보기</Text>
          </View>
          <Text style={styles.voiceText}>{text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

VoiceTimeButton.defaultProps = {
  place: "학교",
  date: "5.10 토",
  time: "오후 4:50",
  text: "음성기록의 앞부분 한줄을 넘어가지 않습니...",
};

const styles = StyleSheet.create({
  voiceButton: {
    flexDirection: "row",
    flex: 1,
    width: 312,
    height: 75,
    borderRadius: 16,
    backgroundColor: theme.grey50,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  place: {
    backgroundColor: theme.yellow100,
    marginRight: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  placeText: { fontSize: 12, color: theme.yellow800, fontWeight: "500" },
  voiceContent: { flex: 1, justifyContent: "center" },
  voiceContentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.grey700,
    marginRight: 8,
  },
  time: { fontSize: 14, fontWeight: "500", color: theme.grey500 },
  dubogi: { fontSize: 12, fontWeight: "700", color: theme.grey400 },
  voiceText: { fontSize: 11.5, fontWeight: "400", color: theme.grey500 },
});
