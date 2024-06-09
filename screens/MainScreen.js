import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import summary from "./SummaryAPI";
import { getDetail, saveDetail } from "./ServerConnect";
import HomeScreen from "./HomeScreen";

const Tab = createBottomTabNavigator();

function InfoScreen() {
  // 서머리 테스트
  const [summaryText, setSummaryText] = useState("");

  // 서버 연결 테스트
  const [fetchedDetail, setFetchedDetail] = useState(null);

  const navigation = useNavigation();
  const date = new Date(2024, 6, 2);

  useEffect(() => {
    // const handleSummary = async () => {
    //   text =
    //     "오늘도 우리 아이와 함께한 하루가 끝나가고 있다. 아침 일찍 눈을 뜨면 아이가 제일 먼저 떠오른다. 아이가 깨기 전에 아침 식사를 준비하고, 아이가 좋아하는 팬케이크를 굽는다. 팬케이크가 익어가는 냄새에 잠에서 깬 아이가 달려와서 엄마, 아빠, 아침 뭐야?라고 물어볼 때마다 그 모습이 얼마나 사랑스러운지 모른다. 아이의 작은 손을 잡고 식탁에 앉아 함께 아침을 먹는 시간은 하루 중 가장 행복한 순간이다. 아침 식사 후, 아이와 함께 놀이터에 가는 것이 우리의 일상이다. 오늘은 특히 하늘이 맑고 바람도 선선해서 놀기에 딱 좋은 날이었다. 아이는 그네를 타고, 미끄럼틀을 타고, 모래사장에서 친구들과 함께 노느라 시간 가는 줄 몰랐다. 그 모습을 지켜보는 나는 아이의 웃음소리에 절로 미소가 지어졌다. 아이가 자라는 모습을 이렇게 가까이서 지켜볼 수 있다는 것이 얼마나 큰 축복인지 새삼 느끼게 된다. 점심시간이 되어 집으로 돌아와 아이에게 점심을 차려주었다. 오늘은 아이가 좋아하는 김치볶음밥을 만들어 주었다. 아이는 맛있게 먹으며 엄마, 아빠, 이거 진짜 맛있어!라고 말해주었다. 아이의 한 마디 한 마디가 우리에게 큰 기쁨이 된다. 식사를 마친 후, 잠시 낮잠을 재우고 나는 집안일을 했다. 아이가 편히 쉴 수 있도록 방을 정리하고, 아이가 좋아하는 장난감도 깔끔하게 정리해 두었다. 낮잠을 자고 일어난 아이와 함께 우리는 책을 읽었다. 아이는 그림책을 좋아해서 다양한 이야기를 함께 읽곤 한다. 오늘은 아이가 특히 좋아하는 공룡 이야기 책을 읽었다. 책 속의 공룡들이 마치 살아 움직이는 듯한 상상을 하며 눈을 반짝이는 아이의 모습은 정말 귀엽다. 아이가 책을 읽으며 상상력을 키워나가는 모습을 보면서 나는 아이가 앞으로 어떤 사람으로 자라게 될지 기대가 된다. 저녁이 되어 가족이 함께 저녁 식사를 했다. 오늘 저녁 메뉴는 아이가 좋아하는 미트볼 스파게티였다. 아이는 음식을 먹으며 우리와 즐겁게 대화를 나누었다. 아이가 하루 동안 어떤 일들이 있었는지, 무엇이 재미있었는지를 이야기해주는 시간은 정말 소중하다. 아이의 이야기를 들으면서 우리는 아이의 생각과 감정을 이해하게 된다. 식사 후, 우리는 가족 모두가 함께 보드게임을 했다. 아이는 게임을 하면서 룰을 배우고, 승패를 경험하며 많은 것을 배운다. 게임을 통해 아이와의 유대감이 깊어지는 것을 느낀다. 오늘 게임에서는 아이가 이겼고, 그 기쁨에 환호하는 모습을 보니 우리도 함께 기뻤다. 하루의 끝자락, 아이를 침대에 눕히고 잠자리 이야기를 해주었다. 아이는 잠들기 전 항상 엄마, 아빠 사랑해요 라고 말하며 우리에게 따뜻한 포옹을 해준다. 아이의 그 한 마디가 우리에게는 하루의 피로를 모두 잊게 해주는 최고의 선물이다. 오늘도 이렇게 소중한 하루가 지나가고, 내일도 아이와 함께할 새로운 날을 기대하며 잠자리에 든다. 아이와 함께한 하루하루가 모여 우리의 추억이 되고, 아이가 자라면서 우리에게 가르쳐주는 것이 참 많다는 것을 느낀다. 아이는 우리의 기쁨이자 희망이다. 매일매일 아이와 함께할 수 있다는 것에 감사하며, 아이가 건강하고 행복하게 자라기를 바라는 마음으로 오늘 일기를 마친다.";
    //   try {
    //     const result = await summary(text);
    //     setSummaryText(result.summary);
    //     console.log(result.summary);
    //   } catch (error) {
    //     console.log("Error summary");
    //   }
    // };
    // handleSummary();
  }, []);

  // 서버 연동 테스트
  const handleSaveDetail = () => {
    saveDetail({
      date: date,
      user_id: 1000,
      detail_home: "홈",
      detail_school: "학교",
      detail_hospital: "병원",
    });
  };

  const handleGetDetail = () => {
    getDetail({ date: date, user_id: 1000 }).then((data) =>
      setFetchedDetail(data)
    );
    console(fetchedDetail);
  };

  return (
    <View style={styles.defaultScreen}>
      <Button
        title="기록보기"
        onPress={() => navigation.push("DetailHistory")}
      />
      <View style={{ padding: 20 }}>
        <Text>{summaryText}</Text>
      </View>
      <Button title="Save User" onPress={handleSaveDetail} />
      <Button title="Get User" onPress={handleGetDetail} />
      {fetchedDetail && (
        <View>
          <Text>{fetchedDetail}</Text>
        </View>
      )}
    </View>
  );
}

function CalendarScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.defaultScreen}>
      <Button
        title="갤러리 테스트"
        onPress={() => navigation.push("GalleryTest", { limit: 10 })}
      />
    </View>
  );
}

function MyPageScreen() {
  return (
    <View style={styles.defaultScreen}>
      <Text>마이페이지</Text>
    </View>
  );
}

export default function MainScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 55,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "green",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          title: "정보",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="book" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: "캘린더",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          title: "마이",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="solution1" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
