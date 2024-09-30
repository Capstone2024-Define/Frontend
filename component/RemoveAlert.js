import { useNavigation } from "@react-navigation/native";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { theme } from "../colors/color";

export default function RemoveAlert({ visible, onClose, onRemove }) {
  const navigation = useNavigation();

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            ...theme.modalBackground,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
              <Text style={styles.title}>삭제하시겠습니까?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={onClose}
                  style={{ ...styles.button, backgroundColor: theme.grey200 }}
                >
                  <Text style={{ ...styles.buttonText, color: theme.grey400 }}>
                    취소
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    onRemove();
                    navigation.pop();
                  }}
                  style={{ ...styles.button, backgroundColor: theme.red }}
                >
                  <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
    justifyContent: "center",
    width: 242,
    height: 158,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 39,
    paddingBottom: 20,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 34,
  },
  button: {
    width: 102,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: "white",
  },
});
