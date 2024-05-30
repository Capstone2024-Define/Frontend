import { View, Text, StyleSheet, Dimensions } from "react-native";
import Toast from "react-native-toast-message";
import { theme } from "../colors/color";

// Dimensions로 화면 크기 가져오기
const SCREEN_WIDTH = Dimensions.get("window").width;

export const showToast = (messsage) => {
  Toast.show({
    type: "success",
    text1: messsage,
    visibilityTime: 1400,
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
    width: 311,
    height: 47,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.green300,
  },
  customToastText: { fontSize: 14, fontWeight: "400", color: theme.grey600 },
});
