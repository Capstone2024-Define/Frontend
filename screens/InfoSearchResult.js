import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

function InfoSearchResult() {
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const route = useRoute();
    const navigation = useNavigation();  // 네비게이션 훅 사용
    const { searchText } = route.params;  // 전달된 검색어를 가져옴

    useEffect(() => {
        const searchDatabase = async () => {
            try {
                const allData = await AsyncStorage.getItem('database'); // 가상의 데이터베이스
                const parsedData = allData ? JSON.parse(allData) : [];
                // 검색어를 포함하는 데이터 필터링
                const results = parsedData.filter(item => item.toLowerCase().includes(searchText.toLowerCase()));
                setSearchResults(results);
            } catch (error) {
                console.error('Error reading data from AsyncStorage:', error);
            } finally {
                setIsLoading(false);
            }
        };
        searchDatabase();
    }, [searchText]);

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>로딩 중...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView style={{ backgroundColor: "#FFFFFF", paddingTop: 50, paddingHorizontal: 16 }}>
                {/* 뒤로가기 버튼 추가 */}
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F6F6F6", borderRadius: 24, paddingVertical: 8, paddingHorizontal: 16, marginBottom: 21 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require("../assets/info_arrow_back.png")} resizeMode={"stretch"} style={{ width: 10, height: 19, marginRight: 11 }} />
                    </TouchableOpacity>
                    <Text style={{ color: "#242424", fontSize: 14, flex: 1 }}>
                        {searchText}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
                    <Text style={{ color: "#555555", fontSize: 16, marginRight: 6 }}>{"총"}</Text>
                    <Text style={{ color: "#78BA7D", fontSize: 16, marginRight: 3 }}>{searchResults ? searchResults.length : 0}</Text>
                    <Text style={{ color: "#555555", fontSize: 16, flex: 1 }}>{"개 검색결과"}</Text>
                </View>

                {/* 검색결과가 있을 경우 */}
                {searchResults && searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                        <View key={index} style={{ paddingVertical: 19, paddingHorizontal: 1 }}>
                            <Text style={{ color: "#242424", fontSize: 14, marginBottom: 15 }}>
                                {result}
                            </Text>
                            <Text style={{ fontSize: 12, width: 326 }}>
                                {"해당 주제에 대한 설명을 여기에 추가."}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={{ color: "#242424", fontSize: 14 }}>검색 결과가 없습니다.</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default InfoSearchResult;
