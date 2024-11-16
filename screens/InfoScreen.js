import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { infos } from "../component/Info";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage 추가
import { theme } from "../colors/color";
import TagChip from "../component/TagChip";

function InfoScreen({ route }) {
  const { ipnumber, user_code } = route.params;
  const [nickName, setNickName] = useState("");
  const [selectedInfos, setSelectedInfos] = useState([]); // 북마크 상태
  const [recommendedinfos, setRecommendedInfos] = useState([]);
  const navigation = useNavigation();

  const handleSearchNavigate = () => {
    navigation.navigate("InfoSearch", {
      ipnumber: ipnumber,
      user_code: user_code,
    });
  };

  const handleDetailNavigate = (key) => {
    navigation.navigate("InfoScreenDetail", { key });
  };

  // 플로팅 버튼 클릭 시 챗봇 연결
  const handleChatbotOpen = () => {
    navigation.navigate("Chatbot", {
      nickName: nickName,
      user_code: user_code,
      ipnumber: ipnumber,
    });
  };

  // 닉네임(유저 이름) 가져오기
  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(
          `http://${ipnumber}:8080/userinfo/get/${user_code}`
        );
        setNickName(response.data.user_name);
        await fetchRecommendedKeywords();
      } catch (error) {
        console.log("유저 GET 에러: ", error);
      }
    }
    load();
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

  // 북마크 로드
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  // 북마크가 변경될 때마다 AsyncStorage에 저장
  useEffect(() => {
    saveBookmarks(selectedInfos);
  }, [selectedInfos]);

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

  const fetchRecommendedKeywords = async () => {
    try {
      const today = new Date(); // 오늘 날짜
      const startDate = new Date();
      startDate.setDate(today.getDate() - 7); // 오늘로부터 7일 전

      const response = await axios.get(
        `http://${ipnumber}:8080/sx/week/${user_code}`,
        {
          headers: {
            "Content-Type": "application/json",
            start: startDate.toLocaleDateString("sv-SE"),
            end: today.toLocaleDateString("sv-SE"),
          },
        }
      );

      const keywords = response.data
        .flatMap((item) => item.checklist)
        .reduce((acc, keyword) => {
          acc[keyword] = (acc[keyword] || 0) + 1;
          return acc;
        }, {});

      const sortedKeywords = Object.entries(keywords)
        .sort((a, b) => b[1] - a[1]) // 빈도수로 정렬
        .map((item) => item[0]); // 키워드만 추출
      console.log("정렬 키워드: ", sortedKeywords);

      // 추천할 정보를 찾음
      const keywordInfosSet = new Set();
      sortedKeywords.forEach((keyword) => {
        for (let i = 0; i < infos.length; i++) {
          if (keywordInfosSet.has(i)) continue;
          if (infos[i].symptom_check.some((symptom) => symptom === keyword)) {
            keywordInfosSet.add(i);
            break;
          }
        }
      });
      const keywordInfos = Array.from(keywordInfosSet);
      console.log("추천 정보: ", keywordInfos);

      // 추천 정보 길이가 3보다 짧으면 랜덤한 인덱스 추가(일주일간 증상체크가 없을 시)
      while (keywordInfos.length < 3) {
        const randomIndex = Math.floor(Math.random() * 13); // 0~12 랜덤 인덱스
        if (!keywordInfos.includes(randomIndex)) {
          keywordInfos.push(randomIndex);
        }
      }

      // 0 ~ 5까지만 잘라서 넣었음
      setRecommendedInfos(keywordInfos.slice(0, 5));
    } catch (error) {
      console.error("추천 검색어 불러오기 오류:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          paddingTop: 20,
          paddingHorizontal: 20,
        }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* 기존 콘텐츠 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#242424",
              fontSize: 22,
              lineHeight: 28,
              fontFamily: "Pretendard-Bold",
            }}
          >
            {"정보"}
          </Text>
          <Image
            source={require("../assets/bookmarkGreen.png")}
            resizeMode={"stretch"}
            style={{ width: 16, height: 19 }}
          />
        </View>
        {/* 검색창 */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F6F6F6",
            borderRadius: 24,
            paddingVertical: 9,
            paddingHorizontal: 16,
            marginBottom: 16,
          }}
          onPress={handleSearchNavigate}
        >
          <Image
            source={require("../assets/search.png")}
            resizeMode={"stretch"}
            style={{ width: 24, height: 24, marginRight: 11 }}
          />
          <Text
            style={{
              color: "#8B8B8B",
              fontSize: 14,
              flex: 1,
              fontFamily: "Pretendard-Medium",
            }}
          >
            {"궁금한 정보를 검색해보세요"}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            marginBottom: 12,
            lineHeight: 30,
            fontFamily: "Pretendard-Bold",
          }}
        >
          <Text style={{ color: theme.green500 }}>{nickName}</Text>
          <Text>{"님을 위한\n추천글"}</Text>
        </Text>

        {/* 추천 정보에 대해 가로 슬라이드 구현 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row" }}>
            {recommendedinfos.map((infoIndex, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.5}
                onPress={() => {
                  handleDetailNavigate(infoIndex);
                }}
                style={{
                  height: 172,
                  justifyContent: "space-between",
                  marginRight: 12,
                }}
              >
                <View>
                  {/* 이미지 */}
                  <ImageBackground
                    source={infos[infoIndex].imageName}
                    resizeMode={"cover"}
                    imageStyle={{ borderRadius: 8 }}
                    style={{
                      flexDirection: "row",
                      width: 144,
                      height: 104,
                      justifyContent: "flex-end",
                      paddingRight: 8,
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => toggleBookmark(index)}
                      style={styles.bookmarkContainer}
                    >
                      <Image
                        source={
                          selectedInfos.includes(index)
                            ? require("../assets/bookmark_green.png")
                            : require("../assets/bookmark.png")
                        }
                        resizeMode={"contain"}
                        style={{ height: 14 }}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                  {/* 타이틀 */}
                  <Text style={styles.title}>{infos[infoIndex].mainTitle}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  {infos[infoIndex].tag.map((tag, index) => (
                    <TagChip key={index} text={tag} />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View
          style={{ height: 1, backgroundColor: "#EBEBEB", marginVertical: 16 }}
        />

        <Text
          style={{
            fontSize: 20,
            marginBottom: 12,
            lineHeight: 30,
            fontFamily: "Pretendard-Bold",
          }}
        >
          {"인기글"}
        </Text>
        {[0, 1].map((row, i) => {
          let minIndex = 0;
          let maxIndex = 0;

          if (row == 0) {
            minIndex = 3;
            maxIndex = 6;
          } else {
            minIndex = 5;
            maxIndex = 8;
          }

          return (
            <View
              key={i}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              {infos.map(
                (info, index) =>
                  index > minIndex &&
                  index < maxIndex && (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.5}
                      onPress={() => {
                        handleDetailNavigate(index);
                      }}
                      style={{
                        height: 220,
                        justifyContent: "space-between",
                        marginRight: 12,
                      }}
                    >
                      <View>
                        {/* 이미지 */}
                        <ImageBackground
                          source={info.imageName}
                          resizeMode={"cover"}
                          imageStyle={{ borderRadius: 8 }}
                          style={{
                            flexDirection: "row",
                            width: 154,
                            height: 152,
                            justifyContent: "flex-end",
                            paddingRight: 8,
                          }}
                        >
                          <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => toggleBookmark(index)}
                            style={[
                              styles.bookmarkContainer,
                              { width: 27, height: 27 },
                            ]}
                          >
                            <Image
                              source={
                                selectedInfos.includes(index)
                                  ? require("../assets/bookmark_green.png")
                                  : require("../assets/bookmark.png")
                              }
                              resizeMode={"contain"}
                              style={{ height: 14 }}
                            />
                          </TouchableOpacity>
                        </ImageBackground>
                        {/* 타이틀 */}

                        <Text style={styles.title}>{info.mainTitle}</Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        {info.tag.map((tag, index) => (
                          <TagChip key={index} text={tag} />
                        ))}
                      </View>
                    </TouchableOpacity>
                  )
              )}
            </View>
          );
        })}

        <View
          style={{
            height: 1,
            backgroundColor: "#EBEBEB",
            marginVertical: 4,
            marginBottom: 17,
          }}
        />

        <Text
          style={{
            fontSize: 20,
            marginBottom: 12,
            lineHeight: 30,
            fontFamily: "Pretendard-Bold",
          }}
        >
          {"고민해결"}
        </Text>

        {infos.map(
          (info, index) =>
            !recommendedinfos.includes(index) && (
              <TouchableOpacity
                key={index}
                activeOpacity={0.5}
                onPress={() => {
                  handleDetailNavigate(index);
                }}
                style={{ flexDirection: "row", marginBottom: 12 }}
              >
                {/* 이미지 */}
                <ImageBackground
                  source={info.imageName}
                  resizeMode={"cover"}
                  imageStyle={{ borderRadius: 8 }}
                  style={{
                    flexDirection: "row",
                    width: 133,
                    height: 90,
                    justifyContent: "flex-end",
                    paddingRight: 8,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => toggleBookmark(index)}
                    style={styles.bookmarkContainer}
                  >
                    <Image
                      source={
                        selectedInfos.includes(index)
                          ? require("../assets/bookmark_green.png")
                          : require("../assets/bookmark.png")
                      }
                      resizeMode={"contain"}
                      style={{ height: 14 }}
                    />
                  </TouchableOpacity>
                </ImageBackground>
                {/* 타이틀 */}
                <View style={{ marginLeft: 16 }}>
                  <Text
                    style={{
                      color: "#242424",
                      fontSize: 14,
                      marginTop: 4,
                      fontFamily: "Pretendard-Bold",
                    }}
                  >
                    {info.mainTitle}
                  </Text>
                  <View style={{ flexDirection: "row", marginTop: 4 }}>
                    {info.tag.map((tag, index) => (
                      <TagChip key={index} text={tag} />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            )
        )}
      </ScrollView>
      {/* 플로팅 버튼 */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleChatbotOpen}
      >
        <Image
          source={require("../assets/chatbot.png")} // 필요한 플로팅 버튼 이미지 경로
          style={{ width: 60, height: 60 }}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute", // 플로팅 버튼을 화면에 고정
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#78BA7D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    color: "#242424",
    fontSize: 14,
    marginTop: 6,
    fontFamily: "Pretendard-Bold",
  },
  bookmarkContainer: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00000060",
    borderRadius: 8,
    marginTop: 8,
  },
});

export default InfoScreen;
