import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import FilterButton from "../component/FilterButton";
import { theme } from "../colors/color";
import VoiceDateButton from "../component/VoiceDateButton";
import Header from "../component/Header";
import { WithLocalSvg } from "react-native-svg/css";
import Search from "../assets/search.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function VoiceHistoryScreen({ navigation }) {
  const [filter, setFilter] = useState("all"); // all, school, hospital
  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState(""); // 검색내용
  const [filteredContents, setFilteredContents] = useState([]); // 검색내용으로 필터링된 컨텐츠

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const rawVoice = await AsyncStorage.getItem("voice");
          const voice = JSON.parse(rawVoice);
          setContents(voice);
          //console.log(voice);
        } catch (e) {
          console.log("기록 로드 에러");
        }
      }
      load();
      handleSearch();
    }, [])
  );

  useEffect(() => {
    handleSearch();
  }, [contents]);

  // 검색 내용 필터링
  const handleSearch = () => {
    if (search) {
      const filtered = contents.filter((content) =>
        content.text.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredContents(filtered);
    } else {
      setFilteredContents(contents);
    }
  };

  // 날짜를 형식에 맞게 바꿔주는 함수
  const getDate = (date) => {
    const newDate = new Date(date);

    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const dayName = dayOfWeek[newDate.getDay()];

    return `${month}.${day} ${dayName}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        left="leftArrow"
        title="음성기록"
        onLeftPress={() => navigation.popToTop()}
        line={true}
      />
      <View
        // 헤더 선이 자꾸 안그어져서 임시로 그냥 선그음
        style={{
          width: "100%",
          height: 1,
          backgroundColor: theme.yellow100,
          marginTop: -1,
        }}
      />
      <View style={styles.subContainer}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInput}
              placeholder="내용으로 검색할수있어요"
              placeholderTextColor={theme.grey400}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.search}
              onPress={handleSearch}
            >
              <WithLocalSvg width={24} height={24} asset={Search} />
            </TouchableOpacity>
          </View>
          <View style={styles.filterView}>
            <FilterButton
              text="전체"
              onPress={() => setFilter("all")}
              onOff={filter === "all" ? "on" : "off"}
              textColor={filter === "all" ? "white" : theme.grey300}
            />
            <FilterButton
              text="학교"
              onPress={() => setFilter("school")}
              onOff={filter === "school" ? "on" : "off"}
              textColor={filter === "school" ? "white" : theme.grey300}
            />
            <FilterButton
              text="병원"
              onPress={() => setFilter("hospital")}
              onOff={filter === "hospital" ? "on" : "off"}
              textColor={filter === "hospital" ? "white" : theme.grey300}
            />
          </View>
        </View>
        <ScrollView style={styles.scroll}>
          {filteredContents
            .slice()
            .reverse()
            .map((content, index) =>
              content.place === filter || filter === "all" ? (
                <View key={index}>
                  <VoiceDateButton
                    place={content.place}
                    date={getDate(content.date)}
                    time={content.time}
                    text={content.text}
                    onPress={() =>
                      navigation.push("DetailVoice", {
                        detail: false,
                        place: content.place,
                        date: content.date,
                        time: content.time,
                      })
                    }
                  />
                </View>
              ) : null
            )}
          <View style={{ marginBottom: 30 }} />
        </ScrollView>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.progressLeft} />
        <View style={styles.progressRight} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  headerContainer: {
    paddingTop: 28,
  },
  textInput: {
    width: 312,
    paddingVertical: 8,
    paddingLeft: 50,
    paddingRight: 16,
    backgroundColor: theme.grey100,
    borderRadius: 24,
    fontSize: 12,
    fontFamily: "Pretendard-Medium",
  },
  search: {
    position: "absolute",
    top: 10, // 이미지의 상단에서 10포인트 떨어진 위치
    right: 270,
  },

  filterView: {
    flexDirection: "row",
    marginVertical: 16,
  },
  progressLeft: {
    width: "50%",
    height: 4,
    backgroundColor: theme.grey150,
  },
  progressRight: {
    width: "50%",
    height: 4,
    backgroundColor: theme.green500,
  },
});
