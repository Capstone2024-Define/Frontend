import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../colors/color";
import Header from "../component/Header";
import axios from "axios";
import { CHATGPT_API_KEY } from "@env";

const MODEL = "gpt-3.5-turbo";

const ChatbotScreen = ({ navigation, route }) => {
  const { ipnumber, user_code } = route.params; // user_code와 ipnumber 가져오기
  const [nickName, setNickName] = useState("");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef(null); // 스크롤 따라가기 위한 참조변수

  // 닉네임 가져오기
  useEffect(() => {
    async function loadNickName() {
      try {
        const response = await axios.get(
          `http://${ipnumber}:8080/userinfo/get/${user_code}`
        );
        setNickName(response.data.user_name);
      } catch (error) {
        console.log("유저 닉네임 불러오기 에러: ", error);
      }
    }
    loadNickName();
  }, [ipnumber, user_code]);

  // 초기 메시지 설정
  useEffect(() => {
    const initialMessages = [
      { sender: "bot", text: `안녕하세요 ${nickName}님!` },
      {
        sender: "bot",
        text: "저는 AI 로빗입니다! ADHD 아이를 키우는데 필요한 정보와 지식으로 도와드릴게요!",
      },
    ];
    setMessages(initialMessages);
  }, [nickName]);

  const getChatbotResponse = async (text) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: MODEL,
          messages: [
            {
              role: "user",
              content: `${text}에 대해 다정한 말투로 "~해요"로 끝나게 존대말로 대답해줘`,
            },
          ],
          max_tokens: 4096,
          temperature: 0.8,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CHATGPT_API_KEY}`,
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error fetching response:", error);
      return "죄송해요, 응답을 생성하는 데 문제가 생겼어요.";
    }
  };
// 미리 정의된 질문과 답변
const predefinedAnswers = {
  "현재 아이의 증상 상태가 궁금해": "아이의 현재 상태는 '~~~~~~~~여기 수정하기'입니다. 이번 주는 아이의 주의 집중력, 과잉행동, 충동성을 체크해보는게 어떨까요?",
  "아이와 대화하는 방법을 알려줘": "아이와 대화할 때는 차분한 톤으로 이야기하고, 아이의 말을 잘 들어주는 것이 중요해요! ",
  "ADHD 기록은 어떻게 하는게 좋을까?": "ADHD 기록은 매일 아이의 행동을 간단히 기록하고, 특이한 점이 있으면 상세히 기록하는 것이 좋아요.",
  "아토목세틴에 대해서 알려줘":"아토목세틴은 노르에피네프린을 선택적으로 증가시키는 비중추신경 자극제예요. 보통 하루에 한 번 복용하지만, 하루 두 번 나누어 복용하면 반항적인 양상과 소화기계 부작용을 줄일 수 있다고 해요.아토목세틴의 부작용으로는 입마름, 식욕 감소, 복통, 구토, 소화불량 같은 위장 관련 증상이나 졸림이 있을 수 있어요. 하지만 대부분 약물 복용량을 조절하면 부작용이 사라지거나 시간이 지나면서 약해진다고 하니 너무 걱정하지 않으셔도 돼요. 😊",
};

// 사용자가 메시지를 보냈을 때 호출되는 함수
const sendMessage = async (text = inputText) => {
  if (text.trim()) {
    // 사용자의 메시지를 추가하기
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text },
    ]);

    setInputText("");

    // 미리 정의된 답변 확인
    if (predefinedAnswers[text.trim()]) {
      // 미리 정의된 답변을 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: predefinedAnswers[text.trim()] },
      ]);
      return;
    }

    setLoading(true);

    // ChatGPT에게 질문을 보내고 응답 받기
    const chatbotResponse = await getChatbotResponse(text);

    // 챗봇 응답 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: chatbotResponse },
    ]);

    setLoading(false);
  }
};


  // 메시지가 변경될 때마다 마지막 메시지로 스크롤
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Header
          left={"leftArrow"}
          title={"AI 로빗"}
          onLeftPress={() => {
            navigation.pop();
          }}
        />
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, backgroundColor: "#F6F6F6" }}
        >
          <View
            style={{
              width: "100%",
              height: 134,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.grey150,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                lineHeight: 20,
                fontFamily: "Pretendard-Regular",
                color: theme.grey300,
              }}
            >
              * 이 서비스는 인공지능(chatGPT)에 의해 제공되는 내용으로, 클로빗의
              공식 의견과 다를 수 있음을 알려드립니다. 따라서 제공되는 정보의
              정확성이나 신뢰성에 대해 클로빗이 보장할 수 없으며, 자료의 정확성,
              저작권 준수여부, 적법성에 대해 책임을 지지 않습니다. 또한 정보
              보호를 위해 개인정보는 입력하지 않도록 주의해주세요.
            </Text>
          </View>
          {/* 메시지 출력 영역 */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 40,
            }}
          >
            {messages.map((message, index) => (
              <View
                key={index}
                style={{
                  flexDirection:
                    message.sender === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  marginVertical: 5,
                  maxWidth: "100%",
                }}
              >
                {message.sender === "bot" && (
                  <Image
                    source={require("../assets/chatRabbit.png")}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      marginRight: 8,
                    }}
                  />
                )}
                <View
                  style={{
                    backgroundColor:
                      message.sender === "user" ? "#78BA7D" : "#FFFFFF",
                    borderRadius: 10,
                    padding: 12,
                    maxWidth: 246,
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: message.sender === "user" ? 10 : 0,
                    borderTopRightRadius: message.sender === "user" ? 0 : 10,
                  }}
                >
                  <Text
                    style={{
                      color: message.sender === "user" ? "#FFFFFF" : "#242424",
                      fontSize: 14,
                      fontFamily: "Pretendard-Regular",
                    }}
                  >
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}
            {/* 로딩 중일 때 표시되는 애니메이션 */}
            {loading && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <Image
                  source={require("../assets/chatRabbit.png")}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    marginRight: 8,
                  }}
                />
                <View
                  style={{
                    width: 75,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                    borderBottomLeftRadius: 8,
                    paddingVertical: 16,
                    paddingHorizontal: 19,
                  }}
                >
                  <Image
                    source={require("../assets/chat1.png")}
                    resizeMode={"stretch"}
                    style={{
                      width: 8,
                      height: 8,
                    }}
                  />
                  <Image
                    source={require("../assets/chat2.png")}
                    resizeMode={"stretch"}
                    style={{
                      width: 8,
                      height: 8,
                    }}
                  />
                  <Image
                    source={require("../assets/chat3.png")}
                    resizeMode={"stretch"}
                    style={{
                      width: 8,
                      height: 8,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* 자주 찾는 질문 */}
        <View
          style={{
            backgroundColor: "#EFEFEF",
            paddingVertical: 16,
          }}
        >
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 7 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => sendMessage("현재 아이의 증상 상태가 궁금해")}
                style={styles.recommandTextContainer}
              >
                <Text
                  style={{
                    color: "#242424",
                    fontSize: 14,
                    lineHeight: 20,
                    fontFamily: "Pretendard-Regular",
                  }}
                >
                  {"현재 아이의 \n증상 상태가 궁금해"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => sendMessage("아이와 대화하는 방법을 알려줘")}
                style={styles.recommandTextContainer}
              >
                <Text
                  style={{
                    color: "#242424",
                    fontSize: 14,
                    lineHeight: 20,
                    fontFamily: "Pretendard-Regular",
                  }}
                >
                  {"아이와 대화하는 \n방법을 알려줘"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => sendMessage("ADHD 기록은 어떻게 하는게 좋을까?")}
                style={styles.recommandTextContainer}
              >
                <Text
                  style={{
                    color: "#242424",
                    fontSize: 14,
                    lineHeight: 20,
                    fontFamily: "Pretendard-Regular",
                  }}
                >
                  {"ADHD 기록은 \n어떻게 하는게 좋을까?"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* 입력 필드 */}
        <View
          style={{
            backgroundColor: "#EFEFEF",
            paddingHorizontal: 20,
            paddingBottom: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              paddingVertical: 0,
              paddingLeft: 17,
              paddingRight: 4,
              marginBottom: 4,
            }}
          >
            <TextInput
              style={{
                color: theme.grey800,
                fontSize: 14,
                flex: 1,
                marginRight: 12,
                paddingVertical: 3,
                fontFamily: "Pretendard-Regular",
              }}
              placeholder="무엇이든 물어보세요!"
              placeholderTextColor="#A5A5A5"
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
            />
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                sendMessage();
              }}
            >
              <Image
                source={
                  inputText.trim()
                    ? require("../assets/chatSendGreen.png")
                    : require("../assets/chatSend.png")
                }
                resizeMode={"stretch"}
                style={{ width: 26, height: 26 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  recommandTextContainer: {
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#78BA7D",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 13,
  },
});

export default ChatbotScreen;
