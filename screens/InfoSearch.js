import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function InfoSearch() {
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();  // 네비게이션 훅 사용

    const handleSearch = () => {
        // 검색 버튼 클릭 시 InfoSearchResult로 이동하면서 검색어를 전달
        navigation.navigate('InfoSearchResult', { searchText });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF", paddingTop: 50, paddingHorizontal: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F6F6F6", borderRadius: 24, paddingVertical: 8, paddingHorizontal: 16, marginBottom: 20 }}>
                    {/* 뒤로가기 버튼 */}
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require("../assets/info_arrow_back.png")} resizeMode={"stretch"} style={{ width: 10, height: 19, marginRight: 11 }} />
                    </TouchableOpacity>
                    {/* 검색 입력창 */}
                    <TextInput
                        style={{ color: "#242424", fontSize: 14, flex: 1, paddingHorizontal: 8 }}
                        placeholder="궁금한 정보를 검색해보세요"
                        placeholderTextColor="#8B8B8B"
                        value={searchText}
                        onChangeText={text => setSearchText(text)}
                        onSubmitEditing={handleSearch}  // 엔터 키로 검색
                    />
                </View>

                <Text style={{ color: "#555555", fontSize: 12, marginBottom: 16 }}>추천 검색어</Text>

                <View 
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                    }}>
                    <View 
                        style={{
                            width: 56,
                            alignItems: "center",
                            backgroundColor: "#D5EAD7",
                            borderRadius: 24,
                            paddingVertical: 8,
                            marginRight: 10,
                        }}>
                        <Text 
                            style={{
                                color: "#436645",
                                fontSize: 12,
                            }}>
                            {"불순응"}
                        </Text>
                    </View>
                    <View 
                        style={{
                            width: 45,
                            alignItems: "center",
                            backgroundColor: "#D5EAD7",
                            borderRadius: 24,
                            paddingVertical: 8,
                            marginRight: 10,
                        }}>
                        <Text 
                            style={{
                                color: "#436645",
                                fontSize: 12,
                            }}>
                            {"반항"}
                        </Text>
                    </View>
                    <View 
                        style={{
                            width: 81,
                            alignItems: "center",
                            backgroundColor: "#D5EAD7",
                            borderRadius: 24,
                            paddingVertical: 8,
                            marginRight: 10,
                        }}>
                        <Text 
                            style={{
                                color: "#436645",
                                fontSize: 12,
                            }}>
                            {"ADHD 증상"}
                        </Text>
                    </View>
                    <View 
                        style={{
                            width: 66,
                            alignItems: "center",
                            backgroundColor: "#D5EAD7",
                            borderRadius: 24,
                            paddingVertical: 8,
                        }}>
                        <Text 
                            style={{
                                color: "#436645",
                                fontSize: 12,
                            }}>
                            {"대처방법"}
                        </Text>
                    </View>
                </View>
                <View 
                    style={{
                        width: 45,
                        height: 28,
                        alignItems: "center",
                        backgroundColor: "#D5EAD7",
                        borderRadius: 24,
                        paddingVertical: 8,
                    }}>
                    <Text 
                        style={{
                            color: "#436645",
                            fontSize: 12,
                        }}>
                        {"갈등"}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default InfoSearch;
