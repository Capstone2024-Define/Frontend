import { StyleSheet, View, Text } from "react-native";
import { theme } from "../colors/color";

export default function SmallTag({ text }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    borderRadius: 24,
    backgroundColor: theme.green100,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.green800,
  },
});
