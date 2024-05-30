import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import VoiceModifyScreen from "./VoiceModifyScreen";

// Dimensions로 화면 크기 가져오기
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Modal2 = ({ visible, onClose }) => {
  // 어두운 배경 눌러도 모달창 닫히게 Pressable
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalBackground} onPress={onClose}>
        <Pressable style={styles.modal2}>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={styles.modal2Text}>이날 하루 기록 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={styles.modal2Text}>삭제하기</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default function DetailVoiceScreen({ navigation }) {
  // 모달창 상태
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.pop()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible1(true)}
          >
            <Text style={styles.headerText}>수정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible2(true)}
          >
            <Ionicons name="ellipsis-vertical-sharp" size={19} color="grey" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.infoHeader}>
          <View style={styles.filter}>
            <Text style={styles.filterText}>학교</Text>
          </View>
          <Text style={styles.date}>5.10 토</Text>
          <Text style={styles.time}>오후 4:50</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>음성요약</Text>
          <Text style={styles.summaryText}>글 요약한 내용 기록 요약</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={{ ...styles.text, paddingBottom: 20 }}>
          음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체
          내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성
          전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용
          음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체
          내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성
          전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용
          음성 전체 내용 음성 전체 내용 음성 전체 내용음성 전체 내용 음성 전체
          내용 음성 전체 내용
        </Text>
      </ScrollView>
      <View style={styles.playView}>
        <TouchableOpacity activeOpacity={0.5}>
          <Ionicons name="play-circle-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <VoiceModifyScreen
        visible={visible1}
        onClose={() => setVisible1(false)}
      />
      <Modal2 visible={visible2} onClose={() => setVisible2(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 23,
  },
  headerText: {
    fontSize: 14,
    marginRight: 10,
  },
  content: {
    paddingHorizontal: 33,
  },
  infoHeader: {
    flexDirection: "row",

    paddingVertical: 20,
    alignItems: "center",
  },
  filter: {
    width: SCREEN_WIDTH / 8,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,
    marginHorizontal: 2,
    backgroundColor: "grey",
  },
  filterText: { fontSize: 14, color: "white" },
  date: {
    fontSize: 16,
    fontWeight: "500",
    marginHorizontal: 10,
  },
  time: {
    fontSize: 16,
    color: "grey",
  },
  summaryBox: {
    height: SCREEN_WIDTH / 3,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "lightgrey",
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "grey",
  },
  text: {
    fontSize: 14,
    color: "grey",
  },
  playView: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgrey",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modal2: {
    marginTop: SCREEN_HEIGHT - 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    paddingBottom: 25,
    backgroundColor: "white",
  },
  modal2Text: {
    fontSize: 14,
    paddingVertical: 6,
  },
});
