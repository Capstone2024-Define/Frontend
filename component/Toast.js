import { View, Text, StyleSheet, Dimensions } from "react-native";
import Toast from "react-native-toast-message";

// Dimensions로 화면 크기 가져오기
const SCREEN_WIDTH = Dimensions.get("window").width;

export const showToast = (messsage) => {
  Toast.show({
    type: "success",
    text1: messsage,
    visibilityTime: 1300,
  });
};

// 토스트 메시지 커스텀
export const toastConfig = {
  success: ({ text1 }) => (
    <View style={styles.customToastContainer}>
      <Text style={styles.customToastText}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  customToastContainer: {
    width: SCREEN_WIDTH - 60,
    height: SCREEN_WIDTH / 6,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    opacity: 0.9,
    marginTop: 10,
  },
  customToastText: { fontSize: 15, fontWeight: "600", color: "white" },
});
