import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../colors/color";

export default function ModalCloseButton({ onClose }) {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onClose}
      style={styles.button}
    >
      <Text
        style={{
          fontSize: 16,
          lineHeight: 24,
          fontFamily: "Pretendard-Bold",
          color: theme.grey400,
        }}
      >
        닫기
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingHorizontal: 10,
    backgroundColor: theme.grey200,
  },
});
