import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { theme } from "../colors/color";
import { Ionicons } from "@expo/vector-icons";
import { WithLocalSvg } from "react-native-svg/css";
import Back from "../assets/arrow_back_ios.svg";

// 모든 SVG 파일을 임포트
const svgMap = {
  Back: Back,
  // 다른 SVG 파일도 여기 추가
};

// 왼쪽 헤더가 화살표 아이콘일때는 left = "leftArrow" 라고 props 보내기
// line은 헤더 아래 선을 그을지 말지 boolean값
export default function Header({
  left,
  title,
  right,
  onLeftPress,
  onRightPress,
  iconName,
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>{title}</Text>
          {iconName ? (
            <WithLocalSvg
              width={20}
              height={20}
              asset={iconName}
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
    backgroundColor: theme.yellow50,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  space: {
    width: 40,
  },
  left: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.green500,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.grey800,
  },
  right: {
    fontSize: 16,
    fontWeight: "500",
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
