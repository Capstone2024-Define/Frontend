import React, { useRef, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { theme } from "../colors/color";
import { showToast } from "../component/Toast";

export default function VoiceModifyScreen({ visible, onClose }) {
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
                onClose();
                showToast("수정이 완료되었어요");
              }}
            >
              <Text style={styles.done}>완료</Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <TextInput style={styles.text} multiline>
              안녕하세요, 선생님. 우리 아이 학교 생활은 잘 하고 있는지
              궁금해서요. 안녕하세요, 어머님. 우리 학생은 매우 열심히 공부하고
              있고, 친구들과도 잘 지내고 있습니다. 다행이네요. 혹시 더 신경 써야
              할 부분이 있을까요? 학업 성적은 좋지만, 최근에 수학 과목에서 조금
              어려움을 겪고 있는 것 같아요. 집에서도 복습을 도와주시면 좋을 것
              같습니다. 알겠습니다. 집에서도 수학 공부를 더 신경 쓰도록 할게요.
              혹시 학교에서 제공하는 추가 보충 수업이 있나요? 네, 매주 화요일과
              목요일에 방과후 보충 수업이 있습니다. 참여하면 도움이 될 거예요.
              그럼 보충 수업에 참여할 수 있도록 하겠습니다. 감사합니다, 선생님.
              네, 도와주셔서 감사합니다. 앞으로도 꾸준히 지켜보면서
              지원하겠습니다. 정말 감사합니다. 앞으로도 잘 부탁드립니다. 네,
              저도 잘 부탁드립니다. 좋은 하루 보내세요.
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
