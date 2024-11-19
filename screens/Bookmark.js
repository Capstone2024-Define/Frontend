import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { infos } from "../component/Info"; // infos 배열을 가져옵니다
import Header from "../component/Header";
import { theme } from "../colors/color";

function Bookmark({ route }) {
  const [bookmarkedInfos, setBookmarkedInfos] = useState([]);
  const [updatedBookMarkInfos, setUpdatedBookMarkInfos] = useState([]);
  const updatedBookMarkInfosRef = useRef([]);
  const navigation = useNavigation();
  const { ipnumber, user_code } = route.params;

  // 북마크 로드, 백핸들러 등록
  useEffect(() => {
    loadBookmarks();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const handleBackPress = () => {
    saveBookmark().then(() => {
      navigation.pop();
    });
    return true; // 기본 뒤로 가기 동작 방지
  };

  // 상세 화면으로 이동
  const handleDetailNavigate = (key) => {
    navigation.navigate("InfoScreenDetail", { key, ipnumber, user_code });
  };

  // AsyncStorage에서 북마크된 데이터 불러오기
  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedInfos");
      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        const sortBookmarks = [...bookmarks].sort();
        setBookmarkedInfos(sortBookmarks);
        setUpdatedBookMarkInfos(sortBookmarks);
        updatedBookMarkInfosRef.current = sortBookmarks;
      }
    } catch (error) {
      console.log("북마크 로딩 오류:", error);
    }
  };

  // 북마크 추가/삭제 및 저장
  const toggleBookmark = (index) => {
    setUpdatedBookMarkInfos((prevSelected) => {
      const updated = prevSelected.includes(index)
        ? prevSelected.filter((s) => s !== index)
        : [...prevSelected, index];
      updatedBookMarkInfosRef.current = updated;
      return updated;
    });
  };

  const saveBookmark = async () => {
    try {
      console.log("저장할 북마크: ", updatedBookMarkInfosRef.current);
      await AsyncStorage.setItem(
        "bookmarkedInfos",
        JSON.stringify(updatedBookMarkInfosRef.current)
      );
    } catch (error) {
      console.log("북마크 저장 에러: ", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Header
        left="leftArrow"
        title="북마크한 정보"
        onLeftPress={async () => {
          await saveBookmark();
          navigation.pop();
        }}
      />
      <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 20 }}>
        {bookmarkedInfos.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 86,
            }}
          >
            <Text style={styles.emptyText}>북마크한 정보가 없어요.</Text>
            <Text style={styles.emptyText}>궁금한 정보를 탐색하고</Text>
            <Text style={styles.emptyText}>북마크 표시해보세요!</Text>
          </View>
        ) : (
          bookmarkedInfos.map((index) => (
            <View key={index} style={styles.bookmarkItem}>
              <TouchableOpacity onPress={() => handleDetailNavigate(index)}>
                <Image source={infos[index].imageName} style={styles.image} />
              </TouchableOpacity>
              <View style={styles.infoContainer}>
                <TouchableOpacity onPress={() => handleDetailNavigate(index)}>
                  <Text style={styles.title}>{infos[index].title}</Text>
                  <Text style={styles.tags}>
                    {infos[index].tag.map((tag) => `#${tag} `)}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => toggleBookmark(index)}>
                <Image
                  source={
                    updatedBookMarkInfos.includes(index)
                      ? require("../assets/bookmark_green.png")
                      : require("../assets/bookmark_gray.png")
                  }
                  style={styles.bookmarkIcon}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // header: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#FFFFFF",
  //   borderColor: "#EBEBEB",
  //   borderWidth: 1,
  //   paddingVertical: 18,
  //   paddingHorizontal: 20,
  // },
  // headerIcon: {
  //   width: 10,
  //   height: 19,
  // },
  // headerText: {
  //   color: "#242424",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
    color: theme.grey400,
  },
  bookmarkItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EBEBEB",
    paddingVertical: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Bold",
    color: "#242424",
    marginTop: 4,
  },
  tags: {
    fontSize: 12,
    lineHeight: 20,
    color: theme.grey400,
    marginTop: 4,
  },
  bookmarkIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginTop: 8,
    marginLeft: 12,
  },
});

export default Bookmark;
