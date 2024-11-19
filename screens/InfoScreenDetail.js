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
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

function InfoScreenDetail({ route }) {
  const navigation = useNavigation();
  const { key, ipnumber, user_code } = route.params;
  const [selectedInfos, setSelectedInfos] = useState([]); // 북마크
  const [viewCount, setViewCount] = useState(0);

  // 테스트
  useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get(`http://${ipnumber}:8080/info/show`);
        setViewCount(data[key].views);
      } catch (error) {
        console.log("조회수 GET: ", error);
      }
    }
    load();
  }, [selectedInfos]);

  useEffect(() => {
    async function viewCountUp() {
      try {
        await axios.put(
          `http://${ipnumber}:8080/info/increase?info_index=${key + 1}`
        );
      } catch (error) {
        console.log("조회수 PUT 에러 ", error);
      }
    }
    viewCountUp();
    loadBookmarks();
  }, []);

  // AsyncStorage에서 북마크 불러오기
  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedInfos");
      if (savedBookmarks) {
        setSelectedInfos(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.log("Error loading bookmarks: ", error);
    }
  };

  // AsyncStorage에 북마크 저장
  const saveBookmarks = async (bookmarks) => {
    try {
      await AsyncStorage.setItem("bookmarkedInfos", JSON.stringify(bookmarks));
    } catch (error) {
      console.log("Error saving bookmarks: ", error);
    }
  };

  // 북마크 추가/삭제 함수
  const toggleBookmark = (index) => {
    setSelectedInfos((prevSelected) => {
      const updated = prevSelected.includes(index)
        ? prevSelected.filter((s) => s !== index)
        : [...prevSelected, index];
      saveBookmarks(updated); // AsyncStorage에 저장
      return updated;
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
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: theme.line_gray,
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
