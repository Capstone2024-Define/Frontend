import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { theme } from "../colors/color";
import { showToast } from "../component/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function VoiceModifyScreen({
  visible,
  date,
  time,
  onClose,
  onUpdateText,
}) {
  const [text, setText] = useState(""); // 내용
  const [voiceList, setVoiceList] = useState([]); // 스토리지 내용

  // 내비게이션
  const navigation = useNavigation();

  // 애니메이션
  const slideAnim = useRef(new Animated.Value(300)).current; // 초기 위치를 화면 밖으로 설정

  // toValue: 애니메이션의 최종값
  // duration: 속도
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
  }, [visible, slideAnim]);

  // 기록 불러오기
  useState(() => {
    const fetchData = async () => {
      try {
        const rawVoice = await AsyncStorage.getItem("voice");
        if (rawVoice) {
          const data = JSON.parse(rawVoice);
          setVoiceList(data);

          // 목표하는 date와 time
          const targetDate = date;
          const targetTime = time;

          // date와 time이 모두 일치하는 객체 필터링
          const filtered = data.filter(
            (item) => item.date === targetDate && item.time === targetTime
          );

          setText(filtered[0].text);
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  // 수정 코드
  const handleEdit = async () => {
    // voiceList에서 date와 time이 일치하는 객체 찾기
    const updatedList = voiceList.map((item) => {
      if (item.date === date && item.time === time) {
        return {
          ...item,
          text: text,
        };
      } else {
        return item;
      }
    });

    try {
      // 수정된 배열을 AsyncStorage에 저장
      await AsyncStorage.setItem("voice", JSON.stringify(updatedList));
      setVoiceList(updatedList);
      console.log(updatedList);
    } catch (error) {
      console.error("객체 수정 실패:", error);
    }
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.overlay} onPress={onClose} />
        <Animated.View
          style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.5} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>음성기록편집</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                handleEdit();
                onUpdateText(text);
                onClose();
                showToast("수정이 완료되었어요");
              }}
            >
              <Text style={styles.done}>완료</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <TextInput style={styles.text} multiline onChangeText={setText}>
              {text}
            </TextInput>
            <View style={{ marginBottom: 40 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "92%",
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 28,
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  done: {
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    color: theme.green500,
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
