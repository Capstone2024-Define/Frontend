import { View, Image, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Shadow } from "react-native-shadow-2";
import { theme } from "../colors/color";

export default function PlusBtn({ onPress }) {
  return (
    <>
      <Shadow distance={5} startColor="#00000009" endColor="#00000000">
        <LinearGradient colors={["#79BA7E", "#AFCA85"]} style={styles.button}>
          <View
            style={[
              styles.button,
              {
                width: 41,
                height: 41,
                backgroundColor: "white",
                borderRadius: 20,
              },
            ]}
          >
            <TouchableOpacity activeOpacity={0.3} onPress={onPress}>
              <Image
                source={require("../assets/add.png")}
                resizeMode="contain"
                style={{ width: 27, height: 27 }}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Shadow>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 20,
          fontFamily: "Pretendard-Bold",
          color: theme.green500,
          marginTop: 10,
        }}
      >
        기록하기
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 43,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 36,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: "white",
  },
});
