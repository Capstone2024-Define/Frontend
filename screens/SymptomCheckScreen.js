import { StyleSheet, View } from "react-native";
import Header from "../component/Header";

export default function SymptomCheckScreen({ navigation }) {
  return (
    <View>
      <Header
        left="이전"
        title="증상체크"
        right="다음"
        onLeftPress={() => navigation.pop()}
        onRightPress={() => navigation.push("DetailRecord")}
        line={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
