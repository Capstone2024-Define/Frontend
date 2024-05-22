import { View, Text, Button, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

// Dimensions로 화면 크기 가져오기
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function DoneRecord({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.progress} />
      <View style={styles.subContainer}>
        <View style={styles.middleView}>
          <AntDesign name="checkcircle" size={80} color="grey" />
          <Text style={styles.middleText}>오늘 기록을 완료했어요!</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.popToTop()}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>완료</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  progress: {
    width: SCREEN_WIDTH,
    height: 7,
    backgroundColor: "lightgrey",
  },
  subContainer: {
    flex: 1,
    padding: 15,
  },
  middleView: {
    flex: 1,
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
    borderRadius: 15,
    padding: 14,
    backgroundColor: "grey",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
});
