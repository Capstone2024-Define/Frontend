import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Dimensions로 화면 크기 가져오기
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function VoiceHistoryScreen({ navigation }) {
  // 어느 필터를 선택했는지 확인할 state
  // all, school, hospital
  const [filter, setFilter] = useState("all");

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={{ flexDirection: "row" }}>
          <TextInput style={styles.textInput} />
          <TouchableOpacity style={styles.search}>
            <Ionicons name="search" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterView}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              ...styles.filter,
              backgroundColor: filter === "all" ? "grey" : "white",
            }}
            onPress={() => {
              setFilter("all");
            }}
          >
            <Text
              style={{
                ...styles.filterText,
                color: filter === "all" ? "white" : "black",
              }}
            >
              전체
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              ...styles.filter,
              backgroundColor: filter === "school" ? "grey" : "white",
            }}
            onPress={() => {
              setFilter("school");
            }}
          >
            <Text
              style={{
                ...styles.filterText,
                color: filter === "school" ? "white" : "black",
              }}
            >
              학교
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              ...styles.filter,
              backgroundColor: filter === "hospital" ? "grey" : "white",
            }}
            onPress={() => {
              setFilter("hospital");
            }}
          >
            <Text
              style={{
                ...styles.filterText,
                color: filter === "hospital" ? "white" : "black",
              }}
            >
              병원
            </Text>
          </TouchableOpacity>
        </View>
        <>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{ alignItems: "center", marginVertical: 5 }}
            onPress={() => navigation.push("DetailVoice")}
          >
            <View style={styles.voiceButton}>
              <View style={styles.place}>
                <Text style={styles.placeText}>병원</Text>
              </View>
              <View style={styles.voiceContent}>
                <Text style={styles.voiceTime}>오후 4:50</Text>
                <Text style={styles.voiceText}>
                  앞 내용 짧은 글로 보여주기 어쩌구
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 30,
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
    marginTop: 15,
    marginBottom: 10,
  },
  filter: {
    width: SCREEN_WIDTH / 8,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    marginHorizontal: 2,
  },
  filterText: { fontSize: 14 },
  voiceButton: {
    flexDirection: "row",
    flex: 1,
    width: SCREEN_WIDTH - 64,
    height: SCREEN_WIDTH / 5,
    borderRadius: 16,
    backgroundColor: "lightgrey",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "grey",
  },
  place: {
    flex: 1,
    backgroundColor: "grey",
    marginRight: 12,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  placeText: { fontSize: 14, color: "white" },
  voiceContent: { flex: 4.5, justifyContent: "center" },
  voiceTime: { fontSize: 16, fontWeight: "500", color: "black" },
  voiceText: { fontSize: 13 },
  progressLeft: {
    width: SCREEN_WIDTH / 2,
    height: 6,
    backgroundColor: "lightgrey",
  },
  progressRight: {
    width: SCREEN_WIDTH / 2,
    height: 6,
    backgroundColor: "grey",
  },
});
