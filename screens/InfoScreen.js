import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Image, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function InfoScreen() {
    const navigation = useNavigation();

    const handleSearchNavigate = () => {
        navigation.navigate('InfoSearch');
    };

    const handleDetailNavigate = () => {
        navigation.navigate('InfoScreenDetail');
    };

    // 플로팅 버튼 클릭 시 챗봇 연결 (주석 처리)
    const handleChatbotOpen = () => {
        // 여기에 챗봇을 연결하는 코드 추가
        console.log("챗봇 열기");
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF", paddingTop: 50, paddingHorizontal: 20 }}>
                {/* 기존 콘텐츠 */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <Text style={{ color: "#242424", fontSize: 22 }}>
                        {"정보"}
                    </Text>
                    <Image
                        source={require("../assets/bookmarkgreen.png")}
                        resizeMode={"stretch"}
                        style={{ width: 16, height: 19 }}
                    />
                </View>
                {/* 검색창 */}
                <TouchableOpacity 
                    style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F6F6F6", borderRadius: 24, paddingVertical: 8, paddingHorizontal: 16, marginBottom: 22 }}
                    onPress={handleSearchNavigate}
                >
                    <Image
                        source={require("../assets/search.png")}
                        resizeMode={"stretch"}
                        style={{ width: 24, height: 24, marginRight: 11 }}
                    />
                    <Text style={{ color: "#8B8B8B", fontSize: 14, flex: 1 }}>
                        {"궁금한 정보를 검색해보세요"}
                    </Text>
                </TouchableOpacity>
    

                <Text style={{ fontSize: 20, marginBottom: 32, width: 318 }}>
                    {"디파인님을 위한\n추천 정보"}
                </Text>

                {/* 추천 정보에 대해 가로 슬라이드 구현 */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        {/* 첫 번째 아이템 */}
                        <TouchableOpacity onPress={handleDetailNavigate} style={{ marginRight: 10 }}>
                            <ImageBackground 
                                source={require("../assets/infoexe.png")} 
                                resizeMode={'stretch'}
                                imageStyle={{ borderRadius: 8 }}
                                style={{ width: 144, height: 104 }}
                            >
                                <View style={{ width: 25, height: 25, backgroundColor: "#0000004D", borderRadius: 8, paddingHorizontal: 7, marginTop: 8 }}>
                                    <Image
                                        source={require("../assets/bookmark.png")} 
                                        resizeMode={"stretch"}
                                        style={{ height: 14, marginTop: 5 }}
                                    />
                                </View>
                            </ImageBackground>
                            <Text style={{ color: "#242424", fontSize: 14, marginTop: 8 }}>
                                {"ADHD 비약물 치료법"}
                            </Text>
                            <Text style={{ color: "#8B8B8B", fontSize: 12 }}>
                                {"#행동치료 #치료법"}
                            </Text>
                        </TouchableOpacity>

                        {/* 두 번째 아이템 */}
                        <TouchableOpacity onPress={handleDetailNavigate} style={{ marginRight: 10 }}>
                            <ImageBackground 
                                source={require("../assets/infoimage.png")} 
                                resizeMode={'stretch'}
                                imageStyle={{ borderRadius: 8 }}
                                style={{ width: 144, height: 104 }}
                            >
                                <View style={{ width: 25, height: 25, backgroundColor: "#00000080", borderRadius: 8, paddingHorizontal: 7, marginTop: 8 }}>
                                    <Image
                                        source={require("../assets/bookmark.png")} 
                                        resizeMode={"stretch"}
                                        style={{ height: 14, marginTop: 5 }}
                                    />
                                </View>
                            </ImageBackground>
                            <Text style={{ color: "#242424", fontSize: 14, marginTop: 8 }}>
                                {"학교에서의 ADHD 지원"}
                            </Text>
                            <Text style={{ color: "#8B8B8B", fontSize: 12 }}>
                                {"#학교지원 #IEP"}
                            </Text>
                        </TouchableOpacity>

                        {/* 세 번째 아이템 */}
                        <TouchableOpacity onPress={handleDetailNavigate}>
                            <ImageBackground 
                                source={require("../assets/infoimage.png")} 
                                resizeMode={'stretch'}
                                imageStyle={{ borderRadius: 8 }}
                                style={{ width: 144, height: 104 }}
                            >
                                <View style={{ width: 25, height: 25, backgroundColor: "#00000080", borderRadius: 8, paddingHorizontal: 7, marginTop: 8 }}>
                                    <Image
                                        source={require("../assets/bookmark.png")} 
                                        resizeMode={"stretch"}
                                        style={{ height: 14, marginTop: 5 }}
                                    />
                                </View>
                            </ImageBackground>
                            <Text style={{ color: "#242424", fontSize: 14, marginTop: 8 }}>
                                {"ADHD 비약물 치료법"}
                            </Text>
                            <Text style={{ color: "#8B8B8B", fontSize: 12 }}>
                                {"#행동치료 #치료법"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={{ height: 1, backgroundColor: "#EBEBEB", marginBottom: 17 }} />

                <Text style={{ color: "#242424", fontSize: 20, marginBottom: 16, marginLeft: 21 }}>
                    {"꼭 읽어야하는 정보"}
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
                    <ImageBackground 
                        source={require("../assets/infoimage.png")} 
                        resizeMode={'stretch'}
                        imageStyle={{ borderRadius: 8 }}
                        style={{ width: 154, height: 152, paddingLeft: 119, paddingRight: 8 }}
                    >
                        <View style={{ width: 27, height: 27, backgroundColor: "#00000080", borderRadius: 8, paddingHorizontal: 8, marginTop: 8 }}>
                            <Image
                                source={require("../assets/bookmark.png")} 
                                resizeMode={"stretch"}
                                style={{ height: 14, marginTop: 6 }}
                            />
                        </View>
                    </ImageBackground>

                    <ImageBackground 
                        source={require("../assets/infoimage.png")} 
                        resizeMode={'stretch'}
                        imageStyle={{ borderRadius: 8 }}
                        style={{ width: 154, height: 152, paddingLeft: 119, paddingRight: 8 }}
                    >
                        <View style={{ width: 27, height: 27, backgroundColor: "#00000080", borderRadius: 8, paddingHorizontal: 8, marginTop: 8 }}>
                            <Image
                                source={require("../assets/bookmark.png")} 
                                resizeMode={"stretch"}
                                style={{ height: 14, marginTop: 6 }}
                            />
                        </View>
                    </ImageBackground>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <Text style={{ color: "#242424", fontSize: 14, width: 146 }}>
                        {"부모의 스트레스 관리: 건강한 양육을 위해"}
                    </Text>
                    <Text style={{ color: "#242424", fontSize: 14, width: 148 }}>
                        {"ADHD 아동을 위한 일상 관리 팁"}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Text style={{ color: "#8B8B8B", fontSize: 12, marginRight: 35 }}>
                        {"#스트레스관리 #부모의건강"}
                    </Text>
                    <Text style={{ color: "#8B8B8B", fontSize: 12, flex: 1 }}>
                        {"#일상관리 #자녀육아"}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 11 }}>
                    <ImageBackground 
                        source={require("../assets/infoimage.png")} 
                        resizeMode={'stretch'}
                        imageStyle={{ borderRadius: 8 }}
                        style={{ width: 154, height: 152, paddingLeft: 119, paddingRight: 8 }}
                    >
                        <View style={{ width: 27, height: 27, backgroundColor: "#00000080", borderRadius: 8, paddingHorizontal: 8, marginTop: 8 }}>
                            <Image
                                source={require("../assets/bookmark.png")} 
                                resizeMode={"stretch"}
                                style={{ height: 14, marginTop: 6 }}
                            />
                        </View>
                    </ImageBackground>

                    <ImageBackground 
                        source={require("../assets/infoimage.png")} 
                        resizeMode={'stretch'}
                        imageStyle={{ borderRadius: 8 }}
                        style={{ width: 154, height: 152, paddingLeft: 119, paddingRight: 8 }}
                    >
                        <View style={{ width: 27, height: 27, backgroundColor: "#00000080", borderRadius: 8, paddingHorizontal: 8, marginTop: 8 }}>
                            <Image
                                source={require("../assets/bookmark.png")} 
                                resizeMode={"stretch"}
                                style={{ height: 14, marginTop: 6 }}
                            />
                        </View>
                    </ImageBackground>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <Text style={{ color: "#242424", fontSize: 14, width: 144 }}>
                        {"자녀의 학습 능력 향상을 위한 전략"}
                    </Text>
                    <Text style={{ color: "#242424", fontSize: 14, width: 145 }}>
                        {"ADHD 아동의 사회적 기술 향상하기"}
                    </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <Text style={{ color: "#8B8B8B", fontSize: 12, marginRight: 4, flex: 1 }}>
                        {"#학습전략 #자녀교육"}
                    </Text>
                    <Text style={{ color: "#8B8B8B", fontSize: 12 }}>
                        {"#스트레스관리 #부모의건강"}
                    </Text>
                </View>

                <View style={{ height: 1, backgroundColor: "#EBEBEB", marginBottom: 17 }} />

                <Text style={{ color: "#242424", fontSize: 20, marginBottom: 16, marginLeft: 21 }}>
                    {"고민해결"}
                </Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                    <Image
                        source={require("../assets/infoimage.png")} 
                        resizeMode={"stretch"}
                        style={{ borderRadius: 8, width: 133, height: 90 }}
                    />
                    <View style={{ width: 156, alignSelf: "flex-start", marginTop: 7 }}>
                        <Text style={{ color: "#242424", fontSize: 14, marginBottom: 15, width: 156 }}>
                            {"ADHD 약물 치료에 부작용이 있나요?"}
                        </Text>
                        <Text style={{ color: "#8B8B8B", fontSize: 12 }}>
                            {"#약물치료 #부작용"}
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
                    <Image
                        source={require("../assets/infoimage.png")} 
                        resizeMode={"stretch"}
                        style={{ borderRadius: 8, width: 133, height: 90 }}
                    />
                    <View style={{ width: 169, alignSelf: "flex-start", marginTop: 7 }}>
                        <Text style={{ color: "#242424", fontSize: 14, marginBottom: 15, width: 169 }}>
                            {"자녀가 친구를 사귀는 데 어려움을 겪을 때, 어떻게 도와줄 수 있을까요?"}
                        </Text>
                        <Text style={{ color: "#8B8B8B", fontSize: 12 }}>
                            {"#친구 #사회성"}
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 37 }}>
                    <Image
                        source={require("../assets/infoimage.png")} 
                        resizeMode={"stretch"}
                        style={{ borderRadius: 8, width: 133, height: 90 }}
                    />
                    <View style={{ width: 169, alignSelf: "flex-start", marginTop: 7 }}>
                        <Text style={{ color: "#242424", fontSize: 14, marginBottom: 15, width: 169 }}>
                            {"자녀와의 소통을 개선하기 위해 어떤 방법을 사용할 수 있을까요?"}
                        </Text>
                        <Text style={{ color: "#8B8B8B", fontSize: 12 }}>
                            {"#소통 #대화"}
                        </Text>
                    </View>
                </View>
            </ScrollView>
 {/* 플로팅 버튼 */}
 <TouchableOpacity style={styles.floatingButton} onPress={handleChatbotOpen}>
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
        position: 'absolute', // 플로팅 버튼을 화면에 고정
        right: 20,  
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30, 
        backgroundColor: '#78BA7D',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 2, 
        elevation: 5, 
    },
});


export default InfoScreen;
