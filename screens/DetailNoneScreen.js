import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Edit from "../assets/notes_white.svg";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import VoiceButton from "../component/VoiceButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

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
        // const rawVoice = await AsyncStorage.getItem("voice");
        // const voices = JSON.parse(rawVoice);
        // if (voices) {
        //   const filteredVoice = voices.filter(
        //     (voice) => voice.date === route.params.date
        //   );
        //   setVoiceList(filteredVoice);
        //}
        const response = await axios.get(
          `http://${ipnumber}:8080/record/list-up/${user_code}/${date}`
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
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>아직 하루기록을 하지 않았어요!</Text>
            <Text style={styles.subText}>
              {`${month}월 ${day}일`}의 하루기록을 해주세요!
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              navigation.push("SymptomCheck", {
                date: date,
                user_code: user_code,
                ipnumber: ipnumber,
              })
            }
          >
            <LinearGradient
              colors={["#79BA7E", "#AFCA85"]}
              style={styles.gradientButton}
            >
              <View style={styles.buttonView}>
                <WithLocalSvg width={18} height={18} asset={Edit} />
                <Text style={styles.buttonText}>하루기록</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.subContainer}>
          <WithLocalSvg width={20} height={20} asset={School} />
          <Text style={styles.guideText}>학교에서 어땠나요?</Text>
        </View>
        {voiceList.map((voice, index) =>
          voice.location === "school" ? (
            <VoiceButton
              key={`school-${index}`}
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
          ) : null
        )}
        <View style={styles.subContainer}>
          <WithLocalSvg width={20} height={20} asset={Hospital} />
          <Text style={styles.guideText}>병원에서 어땠나요?</Text>
        </View>
        {voiceList.map((voice, index) =>
          voice.place === "hospital" ? (
            <VoiceButton
              key={`hospital-${index}`}
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
          ) : null
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
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
  gradientButton: {
    width: 110,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
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
