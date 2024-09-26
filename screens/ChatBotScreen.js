import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatbotScreen = () => {
  const [inputText, setInputText] = useState('');  
  const [messages, setMessages] = useState([]);  

  // 사용자가 메시지를 보냈을 때 호출되는 함수
  const sendMessage = () => {
    if (inputText.trim()) {
      // 새 메시지를 로그에 추가
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'user', text: inputText }
      ]);

      // 챗봇 응답을 추가한 부분 -> 나중에 ai 로 대체 가능
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'bot', text: '제가 도와드릴 수 있어요!' }
        ]);
      }, 1000);

      // 입력 필드 초기화
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={{ flex: 1, backgroundColor: "#F6F6F6", paddingTop: 30 }}>
          
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", paddingVertical: 18, paddingHorizontal: 20, marginBottom: 20 }}>
            <Image
              source={require('../assets/chatBack.png')}  
              resizeMode={"stretch"}
              style={{ width: 24, height: 24 }}
            />
            <View style={{ flex: 1, alignSelf: "stretch" }}>
            </View>
            <Text style={{ color: "#242424", fontSize: 16, marginRight: 150 }}>
              AI 로빗
            </Text>
          </View>

          {/* 메시지 출력 영역 */}
          <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
            {messages.map((message, index) => (
              <View
                key={index}
                style={{
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  marginVertical: 5,
                  maxWidth: '100%',
                }}
              >
                {message.sender === 'bot' && (
                  <Image
                    source={require('../assets/chatRabbit.png')}  
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      marginRight: 8
                    }}
                  />
                )}
                <View
                  style={{
                    backgroundColor: message.sender === 'user' ? '#78BA7D' : '#FFFFFF',
                    borderRadius: 8,
                    padding: 10,
                  }}
                >
                  <Text style={{ color: message.sender === 'user' ? '#FFFFFF' : '#242424', fontSize: 14 }}>
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

        </ScrollView>

        {/* 입력 필드 */}
        <View style={{ backgroundColor: "#EFEFEF", paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 24, paddingVertical: 3, paddingLeft: 17, paddingRight: 4 ,marginBottom:4}}>
            <TextInput
              style={{ color: "#A5A5A5", fontSize: 14, flex: 1 }}
              placeholder="무엇이든 물어보세요!"
              placeholderTextColor="#A5A5A5"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Image
                source={require('../assets/chatSend.png')}  
                resizeMode={"stretch"}
                style={{ width: 26, height: 26 }}
              />
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ChatbotScreen;
