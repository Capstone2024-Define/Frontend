import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { theme } from "../colors/color";

export default function FilterButton({
  text,
  onPress,
  backgroundColor,
  textColor,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{
        ...styles.filter,
        backgroundColor: backgroundColor,
      }}
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
  filter: {
    borderWidth: 1,
    borderRadius: 30,
    borderColor: theme.green500,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  filterText: { fontSize: 14 },
});
