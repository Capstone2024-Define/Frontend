import { StyleSheet, View, Text, SafeAreaView, Image } from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Mic from "../assets/mic_green.svg";
import VoiceButton from "../component/VoiceButton";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import PlusBtn from "../component/PlusBtn";
import { Shadow } from "react-native-shadow-2";

export default function DetailNoneScreen({ route, navigation }) {
  const { ipnumber, user_code, date } = route.params;
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getDate();
  const [voiceList, setVoiceList] = useState([]);

  console.log(ipnumber, user_code, date);

  // useFocusEffect(
  //   useCallback(() => {
  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(
          `${ipnumber}:8080/record/list-up/${user_code}/${date}`
        );
        console.log(response.data);
        setVoiceList(response.data);
      } catch (error) {
        console.log("음성 GET 에러: ", error);
      }
    }
    load();
  }, []);
  // );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        left="leftArrow"
        title={`${month}월 ${day}일`}
        onLeftPress={() => navigation.pop()}
        line={true}
      />
      <View style={styles.container}>
        <Text style={styles.title}>아직 기록하지 않았어요!</Text>
        <Shadow
          distance={5}
          startColor="#00000009"
          endColor="#00000000"
          style={{ width: "100%" }}
        >
          <View style={styles.buttonContainer}>
            <PlusBtn
              onPress={() =>
                navigation.push("SymptomCheck", {
                  date: date,
                  user_code: user_code,
                  ipnumber: ipnumber,
                })
              }
            />
          </View>
        </Shadow>
        <View style={styles.subContainer}>
          <WithLocalSvg width={20} height={20} asset={Mic} />
          <Text style={styles.guideText}>상담녹음</Text>
        </View>
        {voiceList.map((voice, index) => (
          <VoiceButton
            key={`${index}`}
            place={voice.location}
            time={voice.timestamp}
            text={voice.contents}
            onPress={() =>
              navigation.push("DetailVoice", {
                detail: false,
                user_code: user_code,
                ipnumber: ipnumber,
                timestamp: voice.timestamp,
              })
            }
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 24,
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
    marginBottom: 12,
  },
  subText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: theme.grey400,
  },
  subContainer: {
    flexDirection: "row",
    marginBottom: 8,
    marginTop: 20,
    alignItems: "center",
  },
  guideText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    marginLeft: 8,
    color: theme.grey600,
  },
  buttonContainer: {
    width: "100%",
    height: 151,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
