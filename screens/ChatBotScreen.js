import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../colors/color";
import Header from "../component/Header";
import axios from "axios";  // axios 추가

const API_KEY = "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";
const MODEL = "gpt-3.5-turbo";

const ChatbotScreen = ({ navigaion }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  // ChatGPT API 요청 함수
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
          max_tokens: 4096,  // 응답길이 설정
          temperature: 0.8, // 응답 창의성 조정
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error fetching summary:", error);
      return "죄송해요, 응답을 생성하는 데 문제가 생겼어요.";
    }
  };

  // 사용자가 메시지를 보냈을 때 호출되는 함수
  const sendMessage = async (text = inputText) => {
    if (text.trim()) {
      // 사용자의 메시지를 추가하기
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text },
      ]);

      // ChatGPT에게 질문을 보내고 응답 받기
      const chatbotResponse = await getChatbotResponse(text);

      // 챗봇 응답 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: chatbotResponse },
      ]);

      // 입력 필드 초기화하기
      setInputText("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Header left={"leftArrow"} title={"AI 로빗"} onLeftPress={() => {}} />
        <ScrollView
          style={{ flex: 1, backgroundColor: "#F6F6F6", paddingTop: 20 }}
        >
          {/* 메시지 출력 영역 */}
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 40 }}
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
          </ScrollView>
        </ScrollView>

        {/* 자주 찾는 질문 */}
        <View
          style={{
            backgroundColor: "#EFEFEF",
            paddingVertical: 16,
            paddingHorizontal: 20,
          }}
        >
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => sendMessage("현재 아이의 증상 상태가 궁금해")}
                style={{
                  width: 128,
                  backgroundColor: "#FFFFFF",
                  borderColor: "#78BA7D",
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingVertical: 18,
                  paddingHorizontal: 13,
                  marginRight: 13,
                }}
              >
                <Text
                  style={{
                    color: "#242424",
                    fontSize: 14,
                    width: 100,
                  }}
                >
                  {"현재 아이의 \n증상 상태가 궁금해"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => sendMessage("아이와 대화하는 방법을 알려줘")}
                style={{
                  width: 116,
                  backgroundColor: "#FFFFFF",
                  borderColor: "#78BA7D",
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingVertical: 18,
                  paddingHorizontal: 13,
                  marginRight: 13,
                }}
              >
                <Text
                  style={{
                    color: "#242424",
                    fontSize: 14,
                    width: 88,
                  }}
                >
                  {"아이와 대화하는 \n방법을 알려줘"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  sendMessage("ADHD 기록은 어떻게 하는게 좋을까?")
                }
                style={{
                  width: 140,
                  backgroundColor: "#FFFFFF",
                  borderColor: "#78BA7D",
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingVertical: 18,
                  paddingHorizontal: 13,
                }}
              >
                <Text
                  style={{
                    color: "#242424",
                    fontSize: 14,
                    width: 120,
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
            paddingVertical: 10,
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
                fontFamily: "Pretendard-Regular",
              }}
              placeholder="무엇이든 물어보세요!"
              placeholderTextColor="#A5A5A5"
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
            />
            <TouchableOpacity onPress={() => sendMessage()}>
              <Image
                source={require("../assets/chatSend.png")}
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

export default ChatbotScreen;
