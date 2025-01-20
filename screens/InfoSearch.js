import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../colors/color";
import axios from "axios";

function InfoSearch({ route }) {
  const [searchText, setSearchText] = useState("");
  const [recommendedKeywords, setRecommendedKeywords] = useState([]);
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const { user_code, ipnumber } = route.params;

  useFocusEffect(
    useCallback(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [])
  );

  useEffect(() => {
    fetchRecommendedKeywords();
  }, []);

  const fetchRecommendedKeywords = async () => {
    try {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 일요일이 0, 월요일이 1, ..., 토요일이 6 이 되도록
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - dayOfWeek); // 그 주의 일요일 시작
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + (6 - dayOfWeek)); // 그 주의 토요일로 시작

      const response = await axios.get(
        `${ipnumber}:8080/sx/week/${user_code}`,
        {
          headers: {
            "Content-Type": "application/json",
            start: startDate.toISOString().split("T")[0],
            end: endDate.toISOString().split("T")[0],
          },
        }
      );

      const keywords = response.data
        .flatMap((item) => item.checklist) // 각 날짜의 checklist 배열을 합침
        .reduce((acc, keyword) => {
          acc[keyword] = (acc[keyword] || 0) + 1; // 키워드 빈도수 카운트
          return acc;
        }, {});

      const sortedKeywords = Object.entries(keywords)
        .sort((a, b) => b[1] - a[1]) // 빈도수로 정렬
        .slice(0, 5) // 상위 5개 선택
        .map((item) => item[0]); // 키워드만 추출

      setRecommendedKeywords(sortedKeywords);
    } catch (error) {
      console.error("추천 검색어 불러오기 오류:", error);
    }
  };

  const handleSearch = () => {
    navigation.navigate("InfoSearchResult", {
      ipnumber,
      user_code,
      searchText,
    });
  };

  const handleKeywordClick = (keyword) => {
    setSearchText(keyword);
    navigation.navigate("InfoSearchResult", {
      ipnumber,
      user_code,
      searchText: keyword,
    });
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
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F6F6F6",
            borderRadius: 24,
            paddingVertical: 6,
            paddingHorizontal: 16,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={29}
              color={theme.grey400}
              style={{ marginLeft: -6 }}
            />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={{
              color: "#242424",
              fontSize: 14,
              flex: 1,
              paddingLeft: 8,
              fontFamily: "Pretendard-Medium",
            }}
            placeholder="궁금한 정보를 검색해보세요"
            placeholderTextColor="#8B8B8B"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={handleSearch}
          />
        </View>

        <Text
          style={{
            color: "#555555",
            fontSize: 12,
            marginBottom: 12,
            lineHeight: 20,
            fontFamily: "Pretendard-Bold",
          }}
        >
          추천 검색어
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {recommendedKeywords.map((keyword, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleKeywordClick(keyword)}
              style={{
                alignItems: "center",
                backgroundColor: "#D5EAD7",
                borderRadius: 24,
                paddingVertical: 4,
                paddingHorizontal: 12,
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "#436645",
                  fontSize: 12,
                  lineHeight: 20,
                  fontFamily: "Pretendard-Medium",
                }}
              >
                {keyword}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default InfoSearch;
