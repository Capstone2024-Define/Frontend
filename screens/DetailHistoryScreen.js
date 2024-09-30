import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import VoiceButton from "../component/VoiceButton";
import Header from "../component/Header";
import { theme } from "../colors/color";
import { WithLocalSvg } from "react-native-svg/css";
import Note from "../assets/notes.svg";
import Check from "../assets/check.svg";
import Home from "../assets/home_green.svg";
import School from "../assets/school.svg";
import Hospital from "../assets/stethoscope.svg";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SmallTag from "../component/SmallTag";
import { Entypo } from "@expo/vector-icons";
import Edit from "../assets/modal_blackEdit.svg";
import Delete from "../assets/modal_redDelete.svg";
import RemoveAlert from "../component/RemoveAlert";
import ModalCloseButton from "../component/ModalCloseButton";

const Modal2 = ({
  visible,
  onClose,
  date,
  checkList,
  setVisible,
  setRemoveModalVisible,
}) => {
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
        <View style={theme.modalBackground}>
          <Animated.View
            style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setVisible(false);
                navigation.push("DetailModify", {
                  date: date,
                  checkList: checkList,
                });
              }}
              style={{
                flexDirection: "row",
                paddingVertical: 3,
                marginBottom: 20,
              }}
            >
              <WithLocalSvg asset={Edit} style={{ marginRight: 12 }} />
              <Text style={{ ...styles.modalText, color: theme.grey800 }}>
                수정하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setRemoveModalVisible(true);
                onClose();
              }}
              style={{
                flexDirection: "row",
                paddingVertical: 3,
                marginBottom: 23,
              }}
            >
              <WithLocalSvg asset={Delete} style={{ marginRight: 12 }} />
              <Text style={{ ...styles.modalText, color: "#F05757" }}>
                삭제하기
              </Text>
            </TouchableOpacity>
            <ModalCloseButton onClose={onClose} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function DetailHistoryScreen({ navigation, route }) {
  // 상세 기록 state
  const [homeText, setHomeText] = useState("");
  const [schoolText, setSchoolText] = useState("");
  const [hospitalText, setHospitalText] = useState("");
  const [images, setImages] = useState([]);
  const [date, setDate] = useState(route.params.date);
  const [checkList, setCheckList] = useState([]);
  const [symptomList, setSymptomList] = useState([]);
  const [headerColor, setHeaderColor] = useState(theme.green500);

  const [remindVisible, setRemindVisible] = useState(false); // 되돌아보기 드롭다운 활성화
  const [totalText, setTotalText] = useState(""); // 서머리 요약을 위한 전체 텍스트
  const [summaryText, setSummaryText] = useState(""); // 서머리  결과
  const [voiceList, setVoiceList] = useState([]); // 음성 기록

  const [visible, setVisible] = useState(false); // 모달 상태
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

  // 수정하고 돌아왔을때 다시 실행되게 useFocusEffect
  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const rawRecord = await AsyncStorage.getItem(date);
          const newRecord = JSON.parse(rawRecord);

          setHomeText(newRecord.home);
          setSchoolText(newRecord.school);
          setHospitalText(newRecord.hospital);
          setImages(newRecord.image);
          setDate(newRecord.date);
          setCheckList(newRecord.checkList);
          setSymptomList(newRecord.symptomList);
          setSummaryText(newRecord.summaryText);

          // totalText
          let newTotalText = "";
          if (newRecord.home) {
            newTotalText += newRecord.home;
          }
          if (newRecord.school) {
            newTotalText += ` ${newRecord.school}`;
          }
          if (newRecord.hospital) {
            newTotalText += ` ${newRecord.hospital}`;
          }
          setTotalText(newTotalText);

          // console.log(newRecord);
        } catch (e) {
          console.log("기록 로드 에러");
        }
      }
      load();
      // console.log(`전체 텍스트: ${totalText}`);
    }, [])
  );

  // 헤더 이모지 색: 체크리스트 개수에 따라 다른 색을 띄워줌
  useFocusEffect(
    useCallback(() => {
      if (symptomList) {
        const selectedCount = symptomList.length;
        if (selectedCount <= 3) {
          setHeaderColor(theme.green);
        } else if (selectedCount <= 9) {
          setHeaderColor(theme.yellow);
        } else {
          setHeaderColor(theme.pink);
        }
      }
    }, [symptomList])
  );

  // 음성 기록
  useFocusEffect(
    useCallback(() => {
      async function load() {
        try {
          const rawVoice = await AsyncStorage.getItem("voice");
          const voices = JSON.parse(rawVoice);
          if (voices) {
            const filteredVoice = voices.filter((voice) => voice.date === date);
            setVoiceList(filteredVoice);
          }
        } catch (e) {
          console.log("기록 로드 에러");
        }
      }
      load();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        left="leftArrow"
        title={`${new Date(date).getMonth() + 1}월 ${new Date(
          date
        ).getDate()}일`}
        right="circle"
        onLeftPress={() => {
          navigation.popToTop();
        }}
        onRightPress={() => {
          setVisible(true);
        }}
        iconColor={headerColor}
        line={true}
      />
      <ScrollView style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photoScroll}
        >
          {images.map((image) => (
            <View key={image.id}>
              <Image
                source={{ uri: image.uri }}
                style={styles.photo}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
        {summaryText ? (
          <View
            style={{
              ...styles.subContainer,
              backgroundColor: theme.grey100,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              marginHorizontal: 20,
            }}
          >
            <View style={{ marginBottom: 0 }}>
              <View style={{ flexDirection: "row", marginBottom: 4 }}>
                <WithLocalSvg width={20} height={20} asset={Note} />
                <Text style={styles.title}>기록을 요약했어요</Text>
              </View>
              <Text style={{ ...styles.subText, color: theme.grey700 }}>
                {summaryText}
              </Text>
            </View>
          </View>
        ) : null}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagContainer}
        >
          {symptomList.map((symptom, index) => (
            <SmallTag key={index} text={symptom} />
          ))}
          <View style={{ width: 35 }} />
        </ScrollView>
        <View style={styles.line} />
        <View
          style={{
            paddingVertical: 16,
          }}
        >
          <View style={styles.remind}>
            <View style={{ flexDirection: "row" }}>
              <WithLocalSvg width={23} height={23} asset={Check} />
              <Text style={{ ...styles.title, marginLeft: 5 }}>되돌아보기</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setRemindVisible(!remindVisible)}
            >
              {!remindVisible ? (
                <Entypo
                  name="chevron-small-down"
                  size={24}
                  color={theme.grey300}
                />
              ) : (
                <Entypo
                  name="chevron-small-up"
                  size={24}
                  color={theme.grey300}
                />
              )}
            </TouchableOpacity>
          </View>
          {remindVisible ? (
            <View style={{ marginTop: 12, paddingHorizontal: 24 }}>
              {checkList.map((check, index) => (
                <View style={styles.subRemind} key={index}>
                  <FontAwesome name="circle" size={6} color={theme.green300} />
                  <Text style={styles.remindText}>{check}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
        <View style={styles.line} />
        <View style={styles.space} />
        <View style={{ ...styles.subContainer, paddingTop: 16 }}>
          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={Home} />
            <Text style={styles.inputGuideText}>가정에서 어땠나요?</Text>
          </View>
          <View style={styles.recordView}>
            {homeText === "" ? (
              <Text style={{ ...styles.recordText, color: theme.grey500 }}>
                상세기록을 하지 않았어요{"\n"}
              </Text>
            ) : (
              <Text style={styles.recordText}>{homeText}</Text>
            )}
          </View>
          <View style={styles.subTextContainer}>
            <WithLocalSvg width={20} height={20} asset={School} />
            <Text style={styles.inputGuideText}>학교에서 어땠나요?</Text>
          </View>
          <View style={styles.recordView}>
            {schoolText === "" ? (
              <Text style={{ ...styles.recordText, color: theme.grey500 }}>
                상세기록을 하지 않았어요{"\n"}
              </Text>
            ) : (
              <Text style={styles.recordText}>{schoolText}</Text>
            )}
          </View>
          {voiceList.map((voice, index) =>
            voice.place === "school" ? (
              <VoiceButton
                key={`school-${index}`}
                time={voice.time}
                text={voice.text}
                onPress={() =>
                  navigation.push("DetailVoice", {
                    detail: false,
                    place: "school",
                    date: date,
                    time: voice.time,
                  })
                }
              />
            ) : null
          )}
          <View style={{ ...styles.subTextContainer, marginTop: 12 }}>
            <WithLocalSvg width={20} height={20} asset={Hospital} />
            <Text style={styles.inputGuideText}>병원에서 어땠나요?</Text>
          </View>
          <View style={styles.recordView}>
            {hospitalText === "" ? (
              <Text style={{ ...styles.recordText, color: theme.grey500 }}>
                상세기록을 하지 않았어요{"\n"}
              </Text>
            ) : (
              <Text style={styles.recordText}>{hospitalText}</Text>
            )}
          </View>
          {voiceList.map((voice, index) =>
            voice.place === "hospital" ? (
              <VoiceButton
                key={`hospital-${index}`}
                time={voice.time}
                text={voice.text}
                onPress={() =>
                  navigation.push("DetailVoice", {
                    detail: false,
                    place: "hospital",
                    date: date,
                    time: voice.time,
                  })
                }
              />
            ) : null
          )}

          <View style={{ marginBottom: 70 }} />
        </View>
      </ScrollView>
      <Modal2
        visible={visible}
        onClose={() => setVisible(false)}
        date={date}
        checkList={checkList}
        setVisible={setVisible}
        setRemoveModalVisible={setRemoveModalVisible}
      />
      <RemoveAlert
        visible={removeModalVisible}
        onClose={() => setRemoveModalVisible(false)}
        onRemove={() => {
          console.log("상세기록 삭제 기능");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 24,
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  photoScroll: { marginLeft: 20 },
  photo: {
    width: 75,
    height: 75,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 24,
  },
  title: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
  },
  subText: {
    fontSize: 14,
    color: theme.grey600,
    fontFamily: "Pretendard-Regular",
    lineHeight: 20,
  },
  tagContainer: {
    marginLeft: 20,
    marginVertical: 16,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: theme.grey150,
  },
  remind: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  subRemind: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  remindText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: theme.grey800,
  },
  space: {
    width: "100%",
    height: 8,
    backgroundColor: "#F8F8F8",
  },
  subTextContainer: {
    flexDirection: "row",
    marginBottom: 12,
    marginTop: 8,
    alignItems: "center",
  },
  inputGuideText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    marginLeft: 8,
    color: theme.grey600,
  },
  input: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.green50,
    textAlignVertical: "top",
  },
  recordView: {
    flex: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: theme.green50,
  },
  recordText: {
    fontSize: 14,
    color: theme.grey800,
    fontFamily: "Human-beomseok",
    lineHeight: 19.6,
  },
  modal: {
    width: "100%",
    height: 194,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 22,
    paddingBottom: 15,
    paddingHorizontal: 24,
    backgroundColor: "white",
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Medium",
  },
});
