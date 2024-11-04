import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { bottomBtn } from "../component/BottomButton";
import axios from "axios";

export default function SymptomCheckParent({ route, navigation }) {
  const [selectedChecklistItems, setSelectedChecklistItems] = useState([]);
  const { user_code, ipnumber } = route.params;
  const [nickName, setNickName] = useState("");

  // 닉네임(유저 이름) 가져오기
  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(
          `http://${ipnumber}:8080/userinfo/get/${user_code}`
        );
        setNickName(response.data.user_name);
      } catch (error) {
        console.log("유저 GET 에러: ", error);
      }
    }
    load();
  }, []);

  const toggleChecklistItem = (item) => {
    setSelectedChecklistItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  const checklistItems = [
    "욕을 했어요",
    "무시하는 말을 했어요",
    "아이의 말을 자르고 하고 싶은 말을 했어요",
    "“항상”, “절대”라는 표현을 사용했어요",
    "오랫동안 잔소리를 했어요",
    "다른 곳을 보면서 말했어요",
    "서서 혹은 걸어 다니면서 말했어요",
    "높고 날카로운 어조로 말했어요",
    "한번에 여러가지 문제를 말했어요",
    "최악의 상황을 생각해서 말했어요",
    "과거를 들추어서 말했어요",
    "말하고 싶지 않을때 침묵했어요",
    "벌컥 화를 냈어요",
    "내가 한 일을 부정했어요",
    "아이의 작은 실수를 잔소리 했어요",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="되돌아보기"
        onLeftPress={() => {
          navigation.pop();
        }}
      />
      <View style={styles.progressView}>
        <LinearGradient
          colors={["#79BA7E", "#AFCA85"]}
          style={{ width: "66%" }}
          start={{ x: 1, y: 0 }} // 그라데이션의 시작 지점 (오른쪽)
          end={{ x: 0, y: 0 }} // 그라데이션의 끝 지점 (왼쪽)
        >
          <View style={styles.progressLeft} />
        </LinearGradient>
        <View style={styles.progressRight} />
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 94 }}
      >
        <Text style={styles.headerText}>
          {`오늘 ${nickName}님은${"\n"}어떻게 하셨나요?`}
        </Text>
        <Text style={styles.subtitleText}>
          하단 표현을 하시지 않았을 경우 선택하지 않고{"\n"}다음을 눌러주세요
        </Text>
        <View style={styles.checklist}>
          {checklistItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.checklistItem}
              onPress={() => toggleChecklistItem(item)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedChecklistItems.includes(item) &&
                    styles.checkboxSelected,
                ]}
              >
                {selectedChecklistItems.includes(item) && (
                  <Image
                    source={require("../assets/checkmark.png")}
                    style={styles.checkmark}
                  />
                )}
              </View>
              <Text style={styles.checklistText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity> */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.push("DetailRecord", {
              symptomList: route.params.symptomList,
              checkList: selectedChecklistItems,
              date: route.params.date,
              state: route.params.state,
              user_code: route.params.user_code,
              ipnumber: route.params.ipnumber,
            });
          }}
        >
          <LinearGradient
            colors={["#79BA7E", "#AFCA85"]}
            style={bottomBtn.button}
          >
            <Text style={bottomBtn.buttonText}>다음</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  progressView: {
    flexDirection: "row",
    width: "100%",
    height: 4,
  },
  progressLeft: {
    width: "66%",
    backgroundColor: "transparent",
  },
  progressRight: {
    width: "34%",
    backgroundColor: theme.grey150,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "#242424",
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 4,
    fontFamily: "Pretendard-Bold",
  },
  subtitleText: {
    color: "#A5A5A5",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: "Pretendard-Regular",
  },
  checklist: {
    paddingVertical: 10,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  checkbox: {
    width: 18,
    height: 18,
    backgroundColor: "#EFEFEF",
    borderRadius: 4,
    marginRight: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.green500,
  },
  checkmark: {
    width: 11,
    height: 8,
    tintColor: "#fff",
  },
  checklistText: {
    color: "#242424",
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
  },
  nextButton: {
    backgroundColor: theme.green500,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    borderRadius: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Pretendard-Bold",
  },
});
