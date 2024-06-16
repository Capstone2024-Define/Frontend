import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Edit from "../assets/edit.svg";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import VoiceButton from "../component/VoiceButton";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export default function DetailNoneScreen({ route, navigation }) {
  console.log(route.params.date);
  const date = new Date(route.params.date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const [voiceList, setVoiceList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const rawVoice = await AsyncStorage.getItem("voice");
          const voices = JSON.parse(rawVoice);
          if (voices) {
            const filteredVoice = voices.filter(
              (voice) => voice.date === route.params.date
            );
            setVoiceList(filteredVoice);
          }
        } catch (e) {
          console.log("기록 로드 에러");
        }
      }
      load();
    }, [])
  );

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
              navigation.push("SymptomCheck", { date: route.params.date })
            }
          >
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
        {voiceList.map((voice, index) =>
          voice.place === "school" ? (
            <VoiceButton
              key={`school-${index}`}
              time={voice.time}
              text={voice.text}
              onPress={() =>
                navigation.navigate("DetailVoice", {
                  detail: false,
                  place: "school",
                  date: route.params.date,
                  time: voice.time,
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
              time={voice.time}
              text={voice.text}
              onPress={() =>
                navigation.navigate("DetailVoice", {
                  detail: false,
                  place: "hospital",
                  date: route.params.date,
                  time: voice.time,
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
