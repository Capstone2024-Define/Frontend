import { StyleSheet, View, Text } from "react-native";
import { theme } from "../colors/color";

export default function TagChip({ text }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>#{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: theme.grey150,
    marginRight: 8,
    paddingHorizontal: 6,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey400,
  },
});
