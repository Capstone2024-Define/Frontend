import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { infos } from "../component/Info"; // infos 배열을 가져옵니다

function Bookmark() {
  const [bookmarkedInfos, setBookmarkedInfos] = useState([]);
  const navigation = useNavigation();

  // AsyncStorage에서 북마크된 데이터 불러오기
  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem('bookmarkedInfos');
      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        setBookmarkedInfos(bookmarks);
      }
    } catch (error) {
      console.log('북마크 로딩 오류:', error);
    }
  };

  // 북마크 추가/삭제 및 저장
  const toggleBookmark = async (index) => {
    try {
      const updatedBookmarks = bookmarkedInfos.filter((item) => item !== index);
      setBookmarkedInfos(updatedBookmarks);
      await AsyncStorage.setItem('bookmarkedInfos', JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.log('북마크 업데이트 오류:', error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 북마크 로드
  useEffect(() => {
    loadBookmarks();
  }, []);

  // 상세 화면으로 이동
  const handleDetailNavigate = (key) => {
    navigation.navigate("InfoScreenDetail", { key });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>북마크한 정보</Text>
        {bookmarkedInfos.length === 0 ? (
          <Text style={styles.emptyText}>북마크된 정보가 없습니다.</Text>
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
                <TouchableOpacity onPress={() => toggleBookmark(index)}>
                  <Image
                    source={require('../assets/bookmark_green.png')}
                    style={styles.bookmarkIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  bookmarkItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    paddingBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#242424',
  },
  tags: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
    tintColor: '#78BA7D',
    alignSelf: 'flex-end',
  },
});

export default Bookmark;
