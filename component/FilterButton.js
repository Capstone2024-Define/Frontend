import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";

export default function FilterButton({ text, onPress, onOff, textColor }) {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      {onOff === "on" ? (
        <LinearGradient
          colors={["#79BA7E", "#AFCA85"]}
          style={[styles.filterContainer, { backgroundColor: "transparent" }]}
        >
          <Text
            style={{
              ...styles.filterText,
              color: textColor,
            }}
          >
            {text}
          </Text>
        </LinearGradient>
      ) : (
        <View style={styles.filterContainer}>
          <Text
            style={{
              ...styles.filterText,
              color: textColor,
            }}
          >
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  filterContainer: {
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
