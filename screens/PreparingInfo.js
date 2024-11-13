import React from 'react';
import { ScrollView, View, Image, Text, StyleSheet } from 'react-native';
import Header from "../component/Header";

export default function ComingSoonPage({ navigation }) {
  return (
    <ScrollView style={styles.scrollView}>
      <Header
        left="leftArrow"
        title="앱 정보"
        onLeftPress={() => {
          navigation.goBack(); 
        }}
      />

      <View style={styles.centerContainer}>
        <Image
          source={require("../assets/preparing_rabbit.png")}
          resizeMode="stretch"
          style={styles.mainImage}
        />
        <Text style={styles.comingSoonText}>
          아직 <Text style={styles.highlightedText}>준비중</Text>이에요!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  mainImage: {
    height: 198,
    width: 139,
    marginBottom: 20,
    marginTop: 140,
  },
  comingSoonText: {
    color: '#6F6F6F',
    fontSize: 16,
    fontFamily: 'Pretendard-Bold',
  },
  highlightedText: {
    color: '#79BA7E',
  },
});
