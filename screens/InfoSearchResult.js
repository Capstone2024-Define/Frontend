import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../colors/color";
import { infos } from "../component/Info";

function InfoSearchResult() {
  const [searchResults, setSearchResults] = useState(null);
  const [formatText, setFormatText] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation(); // 네비게이션 훅 사용
  const { searchText } = route.params; // 전달된 검색어를 가져옴

  useEffect(() => {
    // const searchDatabase = async () => {
    //   try {
    //     const allData = await AsyncStorage.getItem("database"); // 가상의 데이터베이스
    //     const parsedData = allData ? JSON.parse(allData) : [];
    //     // 검색어를 포함하는 데이터 필터링
    //     const results = parsedData.filter((item) =>
    //       item.toLowerCase().includes(searchText.toLowerCase())
    //     );
    //     setSearchResults(results);
    //   } catch (error) {
    //     console.error("Error reading data from AsyncStorage:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // searchDatabase();
    const searchData = () => {
      let searchResult = [];

      infos.forEach((info, index) => {
        for (const content of info.contents) {
          if (
            content.some(
              (text) =>
                text && text.toLowerCase().includes(searchText.toLowerCase())
            )
          ) {
            searchResult.push(index);
            break;
          }
        }
      });

      setSearchResults(searchResult);
      console.log(searchResult);
      setIsLoading(false);
    };
    searchData();
  }, [searchText]);

  // 검색어를 기준으로 자름
  const getFormatText = (totalText, search) => {
    const searchIndex = totalText.toLowerCase().indexOf(search.toLowerCase());

    // 찾은 위치로부터 왼쪽으로 20자 앞의 문장을 추출
    let startIndex = Math.max(0, searchIndex - 20);
    // 단어 경계에서 시작할 수 있도록 startIndex를 조정
    const leftSpaceIndex = totalText.lastIndexOf(" ", startIndex);
    if (leftSpaceIndex !== -1) {
      startIndex = leftSpaceIndex + 1; // 공백 이후부터 start 시작
    }

    const start = totalText.slice(startIndex, searchIndex);
    const middle = totalText.slice(searchIndex, searchIndex + search.length);
    const end = totalText.slice(searchIndex + search.length);

    return [start, middle, end];
  };

  // 전체 줄글 얻기
  const getTotalText = (index, search) => {
    let totalText = "";

    infos[index].contents.forEach((content) => {
      content.forEach((text) => {
        if (text) totalText += `${text} `;
      });
    });

    return getFormatText(totalText, search);
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>로딩 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 20,
        paddingHorizontal: 20,
      }}
    >
      {/* 뒤로가기 버튼 추가 */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
        style={{ zIndex: 10 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.grey100,
            borderRadius: 24,
            paddingVertical: 6,
            paddingHorizontal: 16,
            marginBottom: 16,
            position: "absolute",
          }}
        >
          {/* <TouchableOpacity onPress={() => navigation.goBack()}> */}
          {/* <Image
              source={require("../assets/info_arrow_back.png")}
              resizeMode={"stretch"}
              style={{ width: 10, height: 19, marginRight: 11 }}
            /> */}
          <Ionicons
            name="chevron-back-outline"
            size={29}
            color={theme.grey400}
            style={{ marginLeft: -6 }}
          />
          {/* </TouchableOpacity> */}
          <Text
            style={{
              color: "#242424",
              fontSize: 14,
              flex: 1,
              paddingLeft: 8,
              fontFamily: "Pretendard-Medium",
            }}
          >
            {searchText}
          </Text>
        </View>
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: "100%",
          paddingTop: 56,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#555555",
              fontSize: 16,
              marginRight: 4,
              fontFamily: "Pretendard-Medium",
            }}
          >
            {"총"}
          </Text>
          <Text
            style={{
              color: "#78BA7D",
              fontSize: 16,
              marginRight: 0,
              fontFamily: "Pretendard-Bold",
            }}
          >
            {searchResults ? searchResults.length : 0}
          </Text>
          <Text
            style={{
              color: "#555555",
              fontSize: 16,
              flex: 1,
              fontFamily: "Pretendard-Medium",
            }}
          >
            {"개 검색결과"}
          </Text>
        </View>

        {/* 검색결과가 있을 경우 */}
        {searchResults && searchResults.length > 0 ? (
          <>
            {searchResults.map((result, index) => {
              const [start, middle, end] = getTotalText(result, searchText);
              return (
                <View key={index}>
                  <View style={styles.line} />
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: 16,
                    }}
                  >
                    <Text
                      style={{
                        color: "#242424",
                        fontSize: 14,
                        lineHeight: 20,
                        fontFamily: "Pretendard-Bold",
                        marginBottom: 8,
                      }}
                    >
                      {infos[result].title}
                    </Text>
                    <View style={{ height: 60 }}>
                      <Text
                        style={styles.contentText}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        <Text style={{ color: theme.grey600 }}>{start}</Text>
                        <Text style={{ color: theme.green500 }}>{middle}</Text>
                        <Text style={{ color: theme.grey600 }}>{end}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          <>
            <View style={styles.line} />
            <View>
              <Text style={{ marginTop: 12, color: "#242424", fontSize: 14 }}>
                검색 결과가 없습니다.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 1,
    backgroundColor: theme.grey200,
  },
  contentText: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
  },
});

export default InfoSearchResult;
