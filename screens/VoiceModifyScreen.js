import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";

export default function VoiceModifyScreen({ visible, onClose }) {
  const navigation = useNavigation();
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.5} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>음성기록편집</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={onClose}>
              <Text style={styles.headerSubText}>완료</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.content}>
            <TextInput multiline>음성 전체 내용</TextInput>
            <View style={{ marginBottom: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "91%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "450",
  },
  headerSubText: {
    fontSize: 16,
    color: "grey",
  },
  content: {
    paddingHorizontal: 33,
    paddingVertical: 15,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
