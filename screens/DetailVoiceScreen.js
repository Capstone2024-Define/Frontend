import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import VoiceModifyScreen from "./VoiceModifyScreen";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import Note from "../assets/notes.svg";
import { FontAwesome } from "@expo/vector-icons";

// 음성녹음 창에서 올때는 이 날 기록보기, 삭제하기를 띄움
const Modal2 = ({ visible, onClose }) => {
  // 이동 위한 내비게이션 추가
  const navigation = useNavigation();

  // 애니메이션
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modal2, { transform: [{ translateY: slideAnim }] }]}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("DetailHistory")}
            >
              <Text style={styles.modal2Text}>이 날 기록 보기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.pop()}
            >
              <Text style={styles.modal2Text}>삭제하기</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// 되돌아보기 창에서 올때는 삭제하기만 띄움
const Modal3 = ({ visible, onClose }) => {
  // 이동 위한 내비게이션 추가
  const navigation = useNavigation();

  // 애니메이션
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // 어두운 배경 눌러도 모달창 닫히게 Pressable
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <Animated.View
            style={[styles.modal3, { transform: [{ translateY: slideAnim }] }]}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                navigation.pop();
              }}
            >
              <Text style={{ ...styles.modal2Text, marginBottom: 0 }}>
                삭제하기
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function DetailVoiceScreen({ navigation, route }) {
  // 모달창 상태
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  // 장소
  const [place, setPlace] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.pop()}>
          <Ionicons name="close" size={24} color={theme.grey800} />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible1(true)}
          >
            <Text style={styles.headerText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible2(true)}
          >
            <View style={styles.space}>
              <FontAwesome
                name="circle"
                size={3.5}
                color={theme.grey400}
                style={{ marginVertical: 1.2 }}
              />
              <FontAwesome
                name="circle"
                size={3.5}
                color={theme.grey400}
                style={{ marginVertical: 1.2 }}
              />
              <FontAwesome
                name="circle"
                size={3.5}
                color={theme.grey400}
                style={{ marginVertical: 1.2 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.infoHeader}>
        {place === "학교" ? (
          <WithLocalSvg width={20} height={20} asset={School} />
        ) : (
          <WithLocalSvg width={20} height={20} asset={Hospital} />
        )}
        <Text style={styles.date}>5.10 토</Text>
        <Text style={styles.time}>오후 4:50</Text>
      </View>
      <View style={styles.summaryBox}>
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <WithLocalSvg width={20} height={20} asset={Note} />
          <Text style={styles.summaryTitle}>음성 기록을 요약했어요</Text>
        </View>
        <Text style={styles.summaryText}>글 요약한 내용 기록 요약</Text>
      </View>
      <ScrollView>
        <Text style={{ ...styles.text, paddingBottom: 20 }}>
          음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체
          내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성
          전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용 음성 전체 내용
        </Text>
      </ScrollView>
      <VoiceModifyScreen
        visible={visible1}
        onClose={() => setVisible1(false)}
      />
      {route.params.detail ? (
        <Modal3 visible={visible2} onClose={() => setVisible2(false)} />
      ) : (
        <Modal2 visible={visible2} onClose={() => setVisible2(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 17,
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  headerText: {
    fontSize: 16,
    marginRight: 12,
    fontFamily: "Pretendard-Medium",
    color: theme.green500,
  },
  space: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    marginHorizontal: 8,
    color: theme.grey700,
  },
  time: {
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    color: theme.grey500,
  },
  summaryBox: {
    width: 312,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.grey50,
    marginBottom: 26,
  },
  summaryTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: theme.grey600,
  },
  summaryText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    lineHeight: 20,
    color: theme.grey500,
  },
  text: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    lineHeight: 20,
    color: theme.grey700,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#1212125C",
  },
  modal2: {
    width: "100%",
    height: 156,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 28,
    paddingBottom: 56,
    paddingHorizontal: 35,
    backgroundColor: "white",
  },
  modal2Text: {
    marginBottom: 24,
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    color: theme.grey700,
  },
  modal3: {
    width: "100%",
    height: 95,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 28,
    paddingBottom: 43,
    paddingHorizontal: 35,
    backgroundColor: "white",
  },
});
