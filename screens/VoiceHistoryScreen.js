import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FilterButton from "../component/FilterButton";
import { theme } from "../colors/color";
import VoiceDateButton from "../component/VoiceDateButton";
import Header from "../component/Header";
import { WithLocalSvg } from "react-native-svg/css";
import Search from "../assets/search.svg";

export default function VoiceHistoryScreen({ navigation }) {
  // 어느 필터를 선택했는지 확인할 state
  // all, school, hospital
  const [filter, setFilter] = useState("all");

  return (
    <View style={styles.container}>
      <Header
        left="leftArrow"
        title="음성기록"
        onLeftPress={() => navigation.popToTop()}
        line={true}
      />
      <View style={styles.subContainer}>
        <ScrollView style={styles.scroll}>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInput}
              placeholder="내용으로 검색할수있어요"
              placeholderTextColor={theme.grey400}
            />
            <TouchableOpacity activeOpacity={0.5} style={styles.search}>
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
          <>
            <VoiceDateButton
              place="학교"
              onPress={() => navigation.push("DetailVoice")}
            />
            <VoiceDateButton
              place="병원"
              onPress={() => navigation.push("DetailVoice")}
            />
            <VoiceDateButton
              place="병원"
              onPress={() => navigation.push("DetailVoice")}
            />
            <VoiceDateButton
              place="병원"
              onPress={() => navigation.push("DetailVoice")}
            />
            <VoiceDateButton
              place="병원"
              onPress={() => navigation.push("DetailVoice")}
            />
            <VoiceDateButton
              place="병원"
              onPress={() => navigation.push("DetailVoice")}
            />
          </>
          <View style={{ marginBottom: 30 }} />
        </ScrollView>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.progressLeft} />
        <View style={styles.progressRight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  scroll: {
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
    fontWeight: "500",
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
