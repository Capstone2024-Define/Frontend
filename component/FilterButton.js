import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { theme } from "../colors/color";

export default function FilterButton({ text, onPress, onOff, textColor }) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={onOff === "on" ? styles.filterOn : styles.filterOff}
      onPress={onPress}
    >
      <Text
        style={{
          ...styles.filterText,
          color: textColor,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  filterOn: {
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: theme.green500,
  },
  filterOff: {
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: theme.grey100,
  },
  filterText: { fontSize: 14, fontFamily: "Pretendard-Medium" },
});
