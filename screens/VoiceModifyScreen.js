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
import axios from "axios";

export default function VoiceModifyScreen({
  visible,
  ipnumber,
  user_code,
  voice,
  onClose,
  onUpdateText,
}) {
  const [text, setText] = useState(""); // 내용

  useEffect(() => {
    if (voice && voice.contents) {
      setText(voice.contents);
    }
  }, [voice]);

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

  // 수정 코드
  const handleEdit = async () => {
    try {
      await axios.put(`http://${ipnumber}:8080/record/edit`, {
        user_code: user_code,
        timestamp: voice.timestamp,
        location: voice.location,
        contents: text,
      });
    } catch (error) {
      console.error("PUT 에러:", error);
    }
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={theme.modalBackground}>
        <View style={styles.overlay} onPress={onClose} />
        <Animated.View
          style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.5} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>상담녹음 수정</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={async () => {
                await handleEdit();
                onUpdateText(text);
                setText(text);
                onClose();
                showToast("수정이 완료되었어요");
              }}
            >
              <Text style={styles.done}>완료</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <TextInput
              style={styles.text}
              multiline
              onChangeText={setText}
              value={text}
            />
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
