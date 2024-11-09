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
import { useNavigation } from "@react-navigation/native";
import { infos } from "../component/Info"; // infos 배열을 가져옵니다
import Header from "../component/Header";
import { theme } from "../colors/color";

function Bookmark() {
  const [bookmarkedInfos, setBookmarkedInfos] = useState([]);
  const navigation = useNavigation();

  // AsyncStorage에서 북마크된 데이터 불러오기
  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedInfos");
      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        setBookmarkedInfos(bookmarks);
      }
    } catch (error) {
      console.log("북마크 로딩 오류:", error);
    }
  };

  // 북마크 추가/삭제 및 저장
  const toggleBookmark = async (index) => {
    try {
      const updatedBookmarks = bookmarkedInfos.filter((item) => item !== index);
      setBookmarkedInfos(updatedBookmarks);
      await AsyncStorage.setItem(
        "bookmarkedInfos",
        JSON.stringify(updatedBookmarks)
      );
    } catch (error) {
      console.log("북마크 업데이트 오류:", error);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    console.log(bookmarkedInfos);
  }, [bookmarkedInfos]);

  // 상세 화면으로 이동
  const handleDetailNavigate = (key) => {
    navigation.navigate("InfoScreenDetail", { key });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
<<<<<<< HEAD
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/arrow_back_ios.png")}
            resizeMode={"stretch"}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <Text style={styles.headerText}>저장한 정보</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
=======
      <Header
        left="leftArrow"
        title="북마크한 정보"
        onLeftPress={() => {
          navigation.pop();
        }}
      />
      <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 20 }}>
        {/* <Text style={styles.header}>북마크한 정보</Text> */}
>>>>>>> refs/remotes/origin/main
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
                  source={require("../assets/bookmark_green.png")}
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
  header: {
<<<<<<< HEAD
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EBEBEB",
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  headerIcon: {
    width: 10,
    height: 19,
  },
  headerText: {
    color: "#242424",
    fontSize: 16,
    fontWeight: "bold",
=======
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
>>>>>>> refs/remotes/origin/main
  },
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
