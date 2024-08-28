import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Back from "../assets/arrow_back_ios.svg";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

// 왼쪽 헤더가 화살표 아이콘일때는 left = "leftArrow" 라고 props 보내기
// line은 헤더 아래 선을 그을지 말지 boolean값
export default function Header({
  left,
  title,
  right,
  onLeftPress,
  onRightPress,
  iconColor,
  line,
}) {
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.5} onPress={onLeftPress}>
          <View style={styles.space}>
            {left === "leftArrow" ? (
              <Ionicons
                name="chevron-back-outline"
                size={27}
                color={theme.grey700}
              />
            ) : (
              <Text style={styles.left}>{left}</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>{title}</Text>
          {iconColor ? (
            <FontAwesome
              name="circle"
              size={20}
              color={iconColor}
              style={{ marginLeft: 8.5 }}
            />
          ) : null}
        </View>
        <TouchableOpacity activeOpacity={0.5} onPress={onRightPress}>
          <View
            style={{
              ...styles.space,
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.right}>{right}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <View style={line && styles.line} /> */}
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
    // fontWeight: "500",
    fontFamily: "Pretendard-Medium",
    color: theme.green500,
  },
  title: {
    fontSize: 16,
    // fontWeight: "500",
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  right: {
    fontSize: 16,
    // fontWeight: "500",
    fontFamily: "Pretendard-Medium",
    color: theme.green500,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: theme.yellow100,
  },
  image: {
    width: 24,
    height: 24,
  },
});
