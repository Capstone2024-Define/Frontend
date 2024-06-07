import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { theme } from "../colors/color";
import { Ionicons } from "@expo/vector-icons";
import { WithLocalSvg } from "react-native-svg/css";
import Back from "../assets/arrow_back_ios.svg";

// 왼쪽 헤더가 화살표 아이콘일때는 left = "leftArrow" 라고 props 보내기
// line은 헤더 아래 선을 그을지 말지 boolean값
export default function Header({
  left,
  title,
  right,
  onLeftPress,
  onRightPress,
  line,
}) {
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.5} onPress={onLeftPress}>
          <View style={styles.space}>
            {left === "leftArrow" ? (
              <WithLocalSvg width={24} height={24} asset={Back} />
            ) : (
              <Text style={styles.left}>{left}</Text>
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.space}>
          <TouchableOpacity activeOpacity={0.5} onPress={onRightPress}>
            <Text style={styles.right}>{right}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={line && styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  space: {
    width: 40,
  },
  left: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.grey700,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.grey700,
  },
  right: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.grey700,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: theme.grey200,
  },
  image: {
    width: 24,
    height: 24,
  },
});
