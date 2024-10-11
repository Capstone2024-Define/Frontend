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
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

export default function VoiceHistoryScreen({ navigation, route }) {
  const user_code = route.params.user_code;
  const ipnumber = route.params.ipnumber;
  const [filter, setFilter] = useState("all"); // all, school, hospital
  const [contents, setContents] = useState([]);
  const [search, setSearch] = useState(""); // 검색내용
  const [filteredContents, setFilteredContents] = useState([]); // 검색내용으로 필터링된 컨텐츠

  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const voice = await axios.get(
            `http://${ipnumber}:8080/record/list-up/${user_code}`
          );
          setContents(voice.data);
        } catch (error) {
          console.log("GET 에러 : ", error);
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
        content.contents.toLowerCase().includes(search.toLowerCase())
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

  const getTime = (time) => {
    const newTime = new Date(time);
    const hours = newTime.getHours();
    const minutes = newTime.getMinutes();
    const period = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${period} ${formattedHours}:${formattedMinutes}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        left="leftArrow"
        title="음성기록"
        onLeftPress={() => navigation.pop()}
      />
      {/* 이상하게 이 화면만 Header 라인이 적용이 안돼서 추가 */}
      <View style={{ width: "100%", height: 1, backgroundColor: "#EBEBEB" }} />
      <View style={styles.subContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.textInput}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.search}
              onPress={handleSearch}
            >
              <WithLocalSvg width={24} height={24} asset={Search} />
            </TouchableOpacity>
            <TextInput
              style={{ flex: 1, fontSize: 12, fontFamily: "Pretendard-Medium" }}
              placeholder="내용으로 검색할수있어요"
              placeholderTextColor={theme.grey400}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
            />
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
        <ScrollView>
          {filteredContents &&
            filteredContents.length > 0 &&
            filteredContents
              .slice()
              .reverse()
              .map((content, index) =>
                content.location === filter || filter === "all" ? (
                  <View key={index}>
                    <VoiceDateButton
                      place={content.location}
                      date={getDate(content.timestamp)}
                      time={getTime(content.timestamp)}
                      text={content.contents}
                      onPress={() =>
                        navigation.push("DetailVoice", {
                          detail: true,
                          user_code: user_code,
                          ipnumber: ipnumber,
                          timestamp: content.timestamp,
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
        <View style={{ ...styles.progress, backgroundColor: theme.grey150 }} />
        <LinearGradient colors={["#79BA7E", "#AFCA85"]} style={styles.progress}>
          <View
            style={{ ...styles.progress, backgroundColor: "transparent" }}
          />
        </LinearGradient>
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
    marginHorizontal: 20,
  },
  headerContainer: {
    paddingTop: 20,
  },
  textInput: {
    flexDirection: "row",
    alignItems: "center",
    width: 312,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.grey100,
    borderRadius: 24,
  },
  search: { marginRight: 10 },

  filterView: {
    flexDirection: "row",
    marginVertical: 16,
  },
  progress: {
    width: "50%",
    height: 4,
  },
});
