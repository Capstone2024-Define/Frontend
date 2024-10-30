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
import TagChip from "../component/TagChip";
import Note from "../assets/notes.svg";
import { WithLocalSvg } from "react-native-svg/css";

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
        <Image
          source={infos[key].imageName}
          resizeMode={"cover"}
          style={{
            width: 360,
            height: 212,
            marginBottom: 19,
            alignItems: "center",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            marginBottom: 8,
            marginLeft: 20,
          }}
        >
          {infos[key].tag.map((tag, index) => (
            <TagChip key={index} text={tag} />
          ))}
        </View>
        <Text
          style={{
            color: "#242424",
            fontSize: 20,
            fontFamily: "Pretendard-Bold",
            marginBottom: 12,
            marginLeft: 20,
          }}
        >
          {infos[key].title}
        </Text>
        <View
          style={{
            backgroundColor: "#F6F6F6",
            borderRadius: 8,
            padding: 12,
            marginBottom: 32,
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            {/* <Image
              source={require("../assets/notes.png")}
              resizeMode={"stretch"}
              style={{ width: 20, height: 20, marginRight: 10 }}
            /> */}
            <WithLocalSvg width={20} height={20} asset={Note} />
            <Text
              style={{
                color: "#242424",
                fontSize: 14,
                fontFamily: "Pretendard-Medium",
                flex: 1,
                marginLeft: 8,
              }}
            >
              {"내용을 요약했어요"}
            </Text>
          </View>
          <Text
            style={{
              color: "#333333",
              fontSize: 14,
              fontFamily: "Pretendard-Regular",
            }}
          >
            {infos[key].summary}
          </Text>
        </View>
        <View
          style={{
            height: 8,
            backgroundColor: "#F7F7F7",
            borderColor: "#ECECEC",
            borderTopWidth: 1,
            marginBottom: 32,
          }}
        />
        {infos[key].contents.map((content, index) => (
          <View key={index}>
            {/* content[0] */}
            {content[0] && (
              <Text
                style={{
                  color: "#242424",
                  fontSize: 16,
                  lineHeight: 24,
                  fontFamily: "Pretendard-Medium",
                  marginBottom: 12,
                  marginLeft: 20,
                }}
              >
                {content[0]}
              </Text>
            )}
            {/* content[1]~끝 */}
            {/* 문단의 끝이면 marginBottom 30 */}
            {content.map(
              (item, index) =>
                index >= 1 && (
                  <Text
                    key={index}
                    style={{
                      color: "#555555",
                      fontSize: 14,
                      lineHeight: 20,
                      fontFamily: "Pretendard-Regular",
                      marginBottom: content[index + 1] ? 12 : 30,
                      marginHorizontal: 20,
                    }}
                  >
                    {item}
                  </Text>
                )
            )}
          </View>
        ))}
        <View
          style={{
            backgroundColor: "#F6F6F6",
            borderRadius: 8,
            padding: 10,
            marginHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "#555555",
              fontSize: 12,
              lineHeight: 20,
              fontFamily: "Pretendard-Regular",
            }}
          >
            출처: {infos[key].origin}
          </Text>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default InfoScreenDetail;
