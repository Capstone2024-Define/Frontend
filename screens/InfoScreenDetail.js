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
import { infos } from "../component/Info";

function InfoScreenDetail({ route }) {
  const navigation = useNavigation(); // useNavigation 훅 사용
  const { key } = route.params;

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
        {/* @@@여기부터 적용했어 infos[key].~~ */}
        <Image
          source={infos[key].imageName}
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
          {infos[key].tag.map((tag, index) => (
            <Text key={index}>#{tag} </Text>
          ))}
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
          {infos[key].title}
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
            {infos[key].summary}
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
        {infos[key].content.map((content, index) => (
          <View key={index}>
            {content[0] && (
              <Text
                style={{
                  color: "#242424",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 18,
                  marginLeft: 21,
                }}
              >
                {content[0]}
              </Text>
            )}
            <Text
              style={{
                color: "#555555",
                fontSize: 14,
                marginBottom: 26,
                marginHorizontal: 21,
                width: 318,
              }}
            >
              {content[1]}
            </Text>
          </View>
        ))}
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
            출처: {infos[key].origin}
          </Text>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default InfoScreenDetail;
