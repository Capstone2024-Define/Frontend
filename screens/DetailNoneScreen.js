import { StyleSheet, View, Text } from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Edit from "../assets/edit.svg";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import VoiceButton from "../component/VoiceButton";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function DetailNoneScreen({ navigation }) {
  return (
    <>
      <Header
        left="leftArrow"
        title="6월 12일"
        onLeftPress={() => navigation.pop()}
        line={true}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>아직 하루기록을 하지 않았어요!</Text>
            <Text style={styles.subText}>6월 12일의 하루기록을 해주세요!</Text>
          </View>
          <TouchableOpacity activeOpacity={0.5}>
            <View style={styles.buttonView}>
              <WithLocalSvg width={18} height={18} asset={Edit} />
              <Text style={styles.buttonText}>하루기록</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.subContainer}>
          <WithLocalSvg width={20} height={20} asset={School} />
          <Text style={styles.guideText}>학교에서 어땠나요?</Text>
        </View>
        <VoiceButton
          onPress={() =>
            navigation.navigate("DetailVoice", {
              detail: false,
            })
          }
        />
        <View style={styles.subContainer}>
          <WithLocalSvg width={20} height={20} asset={Hospital} />
          <Text style={styles.guideText}>병원에서 어땠나요?</Text>
        </View>
        <VoiceButton
          onPress={() =>
            navigation.navigate("DetailVoice", {
              detail: false,
            })
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: theme.grey600,
  },
  subText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: theme.grey400,
  },
  buttonView: {
    width: 110,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: theme.green500,
    borderRadius: 24,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: "white",
  },
  subContainer: {
    flexDirection: "row",
    marginBottom: 8,
    marginTop: 12,
    alignItems: "center",
  },
  guideText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    marginLeft: 8,
    color: theme.grey600,
  },
});
