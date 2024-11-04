import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../colors/color";
import { infos } from "../component/Info";
import TagChip from "../component/TagChip";
import Note from "../assets/notes.svg";
import ViewCount from "../assets/viewcount.svg";
import { WithLocalSvg } from "react-native-svg/css";
import { LinearGradient } from "expo-linear-gradient";

function InfoScreenDetail({ route }) {
  const navigation = useNavigation();
  const { key } = route.params;
  const [selectedInfos, setSelectedInfos] = useState([]); // 북마크
  const [viewCount, setViewCount] = useState(0);

  // 테스트
  useEffect(() => {
    console.log(selectedInfos);
  }, [selectedInfos]);

  const toggleBookmark = (index) => {
    setSelectedInfos((preSelected) => {
      return preSelected.includes(index)
        ? preSelected.filter((s) => s !== index)
        : [...preSelected, index];
    });
  };

  // 나중에 DB 완성되면 거기에 조회수 배열[정보 인덱스] 하나 증가시키기

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <ImageBackground
          source={infos[key].imageName}
          resizeMode={"cover"}
          style={{
            width: "100%",
            height: 272,
            marginBottom: 19,
            alignItems: "center",
          }}
        >
          <LinearGradient
            colors={["#00000040", "transparent"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 60,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 60,
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "transparent",
              paddingLeft: 20,
              paddingRight: 27,
            }}
          >
            {/* TouchableOpacity로 감싸서 뒤로가기 기능 추가 */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back-outline"
                size={27}
                color="white"
                style={{ marginLeft: -6 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => toggleBookmark(key)}
            >
              <Image
                source={
                  selectedInfos.includes(key)
                    ? require("../assets/bookmark_green.png")
                    : require("../assets/bookmark.png")
                }
                resizeMode={"contain"}
                style={{ width: 15, height: 18 }}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
            marginHorizontal: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {infos[key].tag.map((tag, index) => (
              <TagChip key={index} text={tag} />
            ))}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <WithLocalSvg asset={ViewCount} />
            <Text
              style={{
                fontSize: 12,
                lineHeight: 20,
                fontFamily: "Pretendard-Medium",
                color: theme.grey300,
                marginLeft: 4,
              }}
            >
              {viewCount}
            </Text>
          </View>
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
              핵심 포인트만 정리했어요
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
