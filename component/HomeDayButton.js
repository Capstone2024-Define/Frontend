import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { theme } from "../colors/color";

export default function HomeDayButton({ text, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View style={styles.container}>
        <Image
          source={require("../assets/edit.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: 177,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: theme.green500,
  },
  image: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: "white",
  },
});
