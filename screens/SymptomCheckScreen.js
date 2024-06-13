import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Header from "../component/Header";
import { theme } from "../colors/color";

export default function SymptomCheckScreen({ navigation }) {
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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        left="leftArrow"
        title="되돌아보기"
        right="다음"
        onLeftPress={() => {
          navigation.pop();
        }}
        onRightPress={handleNextPress}
        line={false}
      />
      <View style={styles.progressView}>
        <View style={styles.progressLeft}></View>
        <View style={styles.progressRight}></View>
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
              ></View>
              <Text style={styles.checklistText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginBottom: 40 }} />
      </ScrollView>
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  progressView: {
    flexDirection: "row",
    width: "100%",
    height: 4,
  },
  progressLeft: {
    width: "33%",
    backgroundColor: theme.green500,
  },
  progressRight: {
    width: "67%",
    backgroundColor: theme.grey150,
  },
  container: {
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  headerText: {
    color: "#242424",
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "Pretendard-Medium",
  },
  subtitleText: {
    color: "#A5A5A5",
    fontSize: 12,
    marginBottom: 12,
    fontFamily: "Pretendard-Medium",
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
  },
  checkboxSelected: {
    backgroundColor: theme.green500,
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
    fontWeight: "bold",
  },
});
