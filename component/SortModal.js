import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { theme } from "../colors/color";

export default function SortModal({
  visible,
  onClose,
  buttonPosition = { top: 317 },
  sortState,
  setSortState,
}) {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[styles.container, { top: buttonPosition.top + 6, right: 20 }]}
        >
          {/* 확인 버튼 */}
          <TouchableOpacity
            onPress={() => {
              setSortState("viewCount");
              onClose();
            }}
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.text,
                sortState === "viewCount" && {
                  fontFamily: "Pretendard-Bold",
                  color: theme.green500,
                },
              ]}
            >
              조회순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSortState("recent");
              onClose();
            }}
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.text,
                sortState === "recent" && {
                  fontFamily: "Pretendard-Bold",
                  color: theme.green500,
                },
              ]}
            >
              최신순
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 69,
    height: 76,
    justifyContent: "space-between",
    backgroundColor: theme.grey100,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: "absolute",
    zIndex: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey300,
  },
});
