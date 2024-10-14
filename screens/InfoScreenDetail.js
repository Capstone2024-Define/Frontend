import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../colors/color";

function InfoScreenDetail() {
  const navigation = useNavigation(); // useNavigation 훅 사용

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          borderColor: "#EBEBEB",
          borderBottomWidth: 1,
          //   paddingVertical: 13,
          height: 60,
          paddingHorizontal: 20,
          justifyContent: "space-between",
        }}
      >
        {/* TouchableOpacity로 감싸서 뒤로가기 기능 추가 */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* <Image
                            source={require("../assets/arrow_back_ios.png")}
                            resizeMode={"stretch"}
                            style={{ width: 10, height: 19 }}
                        /> */}
          <Ionicons
            name="chevron-back-outline"
            size={27}
            color={theme.grey700}
            style={{ marginLeft: -6 }}
          />
        </TouchableOpacity>
        {/* <View style={{ flex: 1, alignSelf: "stretch" }} /> */}
        <Text
          style={{
            color: "#242424",
            fontSize: 16,
            //fontWeight: "bold",
            fontFamily: "Pretendard-Medium",
          }}
        >
          {"정보 상세"}
        </Text>
        <Image
          source={require("../assets/info_bookmark_gray.png")}
          resizeMode={"stretch"}
          style={{ width: 19, height: 23 }}
        />
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <Image
          source={require("../assets/infoexe.png")}
          resizeMode={"stretch"}
          style={{
            width: 360,
            height: 212,
            marginBottom: 22,
            alignItems: "center",
          }}
        />
        <Text
          style={{
            color: "#8B8B8B",
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: 13,
            marginLeft: 21,
          }}
        >
          {"#행동치료 #치료법"}
        </Text>
        <Text
          style={{
            color: "#242424",
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 16,
            marginLeft: 21,
          }}
        >
          {"ADHD 비약물 치료법"}
        </Text>
        <View
          style={{
            backgroundColor: "#F6F6F6",
            borderRadius: 8,
            paddingVertical: 14,
            paddingHorizontal: 12,
            marginBottom: 32,
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 9,
            }}
          >
            <Image
              source={require("../assets/notes.png")}
              resizeMode={"stretch"}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text
              style={{
                color: "#242424",
                fontSize: 14,
                fontWeight: "bold",
                flex: 1,
              }}
            >
              {"내용을 요약했어요"}
            </Text>
          </View>
          <Text style={{ color: "#333333", fontSize: 14, width: 296 }}>
            {
              "시각적 자극 활용 및 간단한 언어 사용: 시각적 자극과 간단하고 명확한 언어를 사용하여 아이의 주의를 끌고 이해를 촉진합니다.\n\n긍정적인 피드백과 관심사 맞춤 대화: 집중할 때 긍정적인 피드백을 주고, 아이의 관심사와 관련된 주제로 대화하여 주의를 집중시킵니다."
            }
          </Text>
        </View>
        <View
          style={{
            height: 8,
            backgroundColor: "#F7F7F7",
            borderColor: "#ECECEC",
            borderWidth: 1,
            marginBottom: 35,
          }}
        />
        <Text
          style={{
            color: "#555555",
            fontSize: 14,
            marginBottom: 36,
            marginHorizontal: 21,
            width: 318,
          }}
        >
          {
            "치료의 첫 단계는 아동과 가족에게 병에 대해 설명해 아동과 가족이 병을 받아들이고 잘 치료할 수 있도록 돕는 것입니다. 증상이 고착화되기 전인 4~6세의 어린이들은 비약물 치료를 통해 보다 수월하게 ADHD를 치료할 수 있습니다. 비약물 치료법은 ADHD 증상이 경미할 때도 활용할 수 있는데 이 중 행동치료법이 가장 효과가 좋은 것으로 알려져 있습니다."
          }
        </Text>
        <Text
          style={{
            color: "#242424",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 18,
            marginLeft: 21,
          }}
        >
          {"행동치료"}
        </Text>
        <Text
          style={{
            color: "#555555",
            fontSize: 14,
            marginBottom: 26,
            marginHorizontal: 21,
            width: 318,
          }}
        >
          {
            "보상, 칭찬, 모범 등 행동을 개선하도록 돕는 '부모교육' 치료법과 학습 문제 및 또래 관계 관련 기술을 연습하는 '아동 기술 훈련'이 있음"
          }
        </Text>
        <Text
          style={{
            color: "#242424",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 18,
            marginLeft: 21,
          }}
        >
          {"코그메드 훈련"}
        </Text>
        <Text
          style={{
            color: "#555555",
            fontSize: 14,
            marginBottom: 34,
            marginHorizontal: 21,
            width: 318,
          }}
        >
          {
            "PC 프로그램을 통한 훈련으로 순간 집중력과 작업 기억력을 높이는 훈련법"
          }
        </Text>
        <Text
          style={{
            color: "#242424",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 18,
            marginLeft: 21,
          }}
        >
          {"뉴로피드백"}
        </Text>
        <Text
          style={{
            color: "#555555",
            fontSize: 14,
            marginBottom: 32,
            marginHorizontal: 21,
            width: 318,
          }}
        >
          {"뇌파를 측정해 집중할 때 나오는 뇌파가 나타나면 보상하는 훈련법"}
        </Text>
        <Text
          style={{
            color: "#555555",
            fontSize: 14,
            marginBottom: 41,
            marginHorizontal: 21,
            width: 318,
          }}
        >
          {
            "ADHD 증상이 고착화된 이후 아이의 일상생활에 무리가 있다고 느끼면 약물치료를 받는게 좋습니다. 약물치료는 ADHD 치료에서 가장 중심이 되는 치료법으로 70~80% 정도 효과가 높은 것으로 알려져 있습니다. 우리나라에서 처방할 수 있는 약으로는 메틸페이데이트, 아토목세틴, 클로니딘, 웰부트린, 삼환계 항우울제 등이 있습니다. 약물의 종류는 효과, 부작용 등 차이가 있으므로 환자 특성에 맞춰 선택할 수 있으며 부작용은 그리 크지 않습니다. 혹시 부작용이 발생할 경우 약 복용을 중단하면 부작용은 사라집니다."
          }
        </Text>
        <View
          style={{
            backgroundColor: "#F6F6F6",
            borderRadius: 8,
            paddingVertical: 14,
            paddingHorizontal: 11,
            marginHorizontal: 20,
          }}
        >
          <Text style={{ color: "#555555", fontSize: 12 }}>
            {"출처 : 강북삼성병원 - 행복 건강정보"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default InfoScreenDetail;
