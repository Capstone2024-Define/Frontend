import { View, Text, Button, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import Header from "../component/Header";
import { theme } from "../colors/color";

export default function SymptomResultScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Header
        left="이전"
        title="측정 결과"
        right="다음"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={() => {
          navigation.push("DetailRecord");
        }}
        line={false}
      />
      <View style={styles.container}>
        <View style={styles.progressView}>
          <View style={styles.progressLeft}></View>
          <View style={styles.progressRight}></View>
        </View>
        <View style={styles.subContainer}>
          <AntDesign name="checkcircle" size={80} color="grey" />
          <Text style={styles.middleText}>
            오늘 아이의 상태는 아주좋음이네요
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  progressView: {
    flexDirection: "row",
    width: "100%",
    height: 8,
  },
  progressLeft: {
    width: "66%",
    backgroundColor: theme.green500,
  },
  progressRight: {
    width: "34%",
    backgroundColor: theme.grey150,
  },
  subContainer: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  middleText: {
    marginTop: 25,
    fontSize: 15,
    fontWeight: "bold",
    color: "grey",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "grey",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
});
