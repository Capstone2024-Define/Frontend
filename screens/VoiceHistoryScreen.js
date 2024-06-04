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
import VoiceTimeButton from "../component/VoiceTimeButton";
import Header from "../component/Header";

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
      <ScrollView style={styles.scroll}>
        <View style={{ flexDirection: "row" }}>
          <TextInput style={styles.textInput} />
          <TouchableOpacity style={styles.search}>
            <Ionicons name="search" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterView}>
          <FilterButton
            text="전체"
            onPress={() => setFilter("all")}
            backgroundColor={filter === "all" ? theme.green500 : "white"}
            textColor={filter === "all" ? "white" : theme.green500}
          />
          <FilterButton
            text="학교"
            onPress={() => setFilter("school")}
            backgroundColor={filter === "school" ? theme.green500 : "white"}
            textColor={filter === "school" ? "white" : theme.green500}
          />
          <FilterButton
            text="병원"
            onPress={() => setFilter("hospital")}
            backgroundColor={filter === "hospital" ? theme.green500 : "white"}
            textColor={filter === "hospital" ? "white" : theme.green500}
          />
        </View>
        <>
          <VoiceTimeButton onPress={() => navigation.push("DetailVoice")} />
        </>
        <View style={{ marginBottom: 30 }} />
      </ScrollView>

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
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  textInput: {
    flex: 1,
    backgroundColor: "lightgrey",
    borderRadius: 80,
    paddingVertical: 2,
    paddingLeft: 15,
    paddingRight: 35,
  },
  search: {
    position: "absolute",
    top: 5, // 이미지의 상단에서 10포인트 떨어진 위치
    right: 10,
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
