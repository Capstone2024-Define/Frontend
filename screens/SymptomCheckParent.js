import React, { useState } from "react";
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

export default function SymptomCheckParent({ route, navigation }) {
  const [selectedChecklistItems, setSelectedChecklistItems] = useState([]);

  const toggleChecklistItem = (item) => {
    setSelectedChecklistItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((i) => i !== item)
        : [...prevSelected, item]
    );
  };

  const checklistItems = [
    "돌려서 말했어요",
    "아이에게 천천히 설명했어요",
    "차례를 기다리고, 짧게 말했어요",
    "“대부분”, “가끔” 등의 표현으로 돌려서 표현했어요",
    "잔소리 대신 필요한 내용만 짧게 이야기했어요",
    "아이와 눈을 마주치며 대화했어요",
    "아이에게 집중해서 대화했어요",
    "차분하고 침착한 말투로 대화했어요",
    "하나의 문제를 다 말하고 다음 문제를 말했어요",
    "넘겨짚어서 생각하지 않았어요",
    "현재의 문제만 이야기했어요",
    "느끼는 것을 솔직하게 말해주었어요",
    "벌컥 화내지 않고 마음을 가라앉히고 대화했어요",
    "자신이 한 일을 인정하고 대화했어요",
    "아이의 사소한 실수는 눈 감아주었어요",
  ];

  const handleNextPress = () => {
    navigation.push("SymptomResult", {
      selectedItems: selectedChecklistItems,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="이전"
        title="되돌아보기"
        right="다음"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={() => {
          navigation.push("DetailRecord", {
            symptomList: route.params.symptomList,
            checkList: selectedChecklistItems,
            date: route.params.date,
            state: route.params.state,
          });
        }}
        line={false}
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
      <ScrollView style={styles.container}>
        <Text style={styles.headerText}>
          오늘 지현님은 {"\n"}어떻게 하셨나요?
        </Text>
        <Text style={styles.subtitleText}>
          오늘 하루 아이와 어떻게 지냈는지 되돌아봐요.
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
        <View style={{ marginBottom: 40 }} />
      </ScrollView>
      {/* <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity> */}
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
