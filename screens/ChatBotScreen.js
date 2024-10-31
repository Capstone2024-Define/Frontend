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
import axios from "axios"; 

const API_KEY = "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";
const MODEL = "gpt-3.5-turbo";

const ChatbotScreen = ({ navigaion }) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);  // 챗봇 입력 중 상태

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
          max_tokens: 4096,
          temperature: 0.8,
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text },
      ]);
      setInputText("");
      
      // 로딩 상태 추가
      setLoading(true);
      
      const chatbotResponse = await getChatbotResponse(text);

      // 챗봇 응답 추가 후 로딩 상태 제거
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: chatbotResponse },
      ]);
      setLoading(false);
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
          </ScrollView>
        </ScrollView>

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
