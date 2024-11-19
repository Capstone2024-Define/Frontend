import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../colors/color";
import { infos } from "../component/Info";
import { Entypo } from "@expo/vector-icons";
import SortModal from "../component/SortModal";
import axios from "axios";

function InfoSearchResult() {
  const [searchResults_recent, setSearchResults_recent] = useState(null); // 최신순 검색결과
  const [searchResults_viewcount, setSearchResults_viewcount] = useState(null); // 조회순 검색결과
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortState, setSortState] = useState("viewCount"); // 디폴트 조회순
  const route = useRoute();
  const navigation = useNavigation(); // 네비게이션 훅 사용
  const { searchText, ipnumber, user_code } = route.params; // 전달된 검색어를 가져옴

  // 원하는 위치에 모달 띄우기
  const [buttonPosition, setButtonPosition] = useState({ top: 0 });
  const buttonRef = useRef(null);
  const openModal = () => {
    // 버튼 위치 가져오기
    buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
      setButtonPosition({ top: pageY + height });
    });
    setModalVisible(true);
  };

  useEffect(() => {
    console.log("정렬 방법: ", sortState);
  }, [sortState]);

  useEffect(() => {
    const searchData = async () => {
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

      console.log("검색결과: ", searchResult);

      // 최신순
      const reverseSearchResult = searchResult.reverse();
      setSearchResults_recent(reverseSearchResult);

      // 조회순
      try {
        const { data } = await axios.get(
          `http://${ipnumber}:8080/info/show/view`
        );
        console.log(data);

        const searchResultSet = new Set(searchResult);

        let viewCountSearchResult = data
          .filter((item) => searchResultSet.has(item.info_index - 1))
          .sort((a, b) => b.views - a.views)
          .map((item) => item.info_index - 1);
        console.log("조회순: ", viewCountSearchResult);
        setSearchResults_viewcount(viewCountSearchResult);
      } catch (error) {
        console.log("조회순 GET 에러: ", error);
      }
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

  const renderResults = (results) => {
    if (results && results.length > 0) {
      return results.map((result, index) => {
        const [start, middle, end] = getTotalText(result, searchText);
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate("InfoScreenDetail", {
                key: result,
                ipnumber,
                user_code,
              })
            }
          >
            <View
              style={{
                width: "100%",
                paddingVertical: 14,
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
            <View style={styles.line} />
          </TouchableOpacity>
        );
      });
    } else {
      return (
        <View>
          <Text style={{ marginTop: 12, color: "#242424", fontSize: 14 }}>
            검색 결과가 없습니다.
          </Text>
        </View>
      );
    }
  };

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
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
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
              {searchResults_recent ? searchResults_recent.length : 0}
            </Text>
            <Text
              style={{
                color: "#555555",
                fontSize: 16,
                fontFamily: "Pretendard-Medium",
              }}
            >
              {"개 검색결과"}
            </Text>
          </View>
          <TouchableOpacity
            ref={buttonRef}
            activeOpacity={0.5}
            onPress={openModal}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                lineHeight: 20,
                fontFamily: "Pretendard-Medium",
                color: theme.grey400,
              }}
            >
              {sortState === "viewCount" ? "조회순" : "최신순"}
            </Text>
            <Entypo name="chevron-small-down" size={20} color={theme.grey400} />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />

        {/* 검색결과가 있을 경우 */}
        {sortState === "viewCount"
          ? renderResults(searchResults_viewcount)
          : renderResults(searchResults_recent)}
      </ScrollView>
      <SortModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        buttonPosition={buttonPosition}
        sortState={sortState}
        setSortState={setSortState}
      />
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
