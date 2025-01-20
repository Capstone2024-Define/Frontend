import React, { useEffect } from "react";
import { ScrollView, View, Image, Text, StyleSheet } from "react-native";
import Header from "../component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ComingSoonPage({ navigation }) {
  useEffect(() => {
    async function clearAsync() {
      await AsyncStorage.clear();
    }
    clearAsync();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <Header
        left="leftArrow"
        title="이용가이드"
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
    paddingBottom: 30,
  },
  mainImage: {
    height: 198,
    width: 139,
    marginBottom: 20,
    marginTop: 140,
  },
  comingSoonText: {
    color: "#6F6F6F",
    fontSize: 16,
    fontFamily: "Pretendard-Bold",
  },
  highlightedText: {
    color: "#79BA7E",
  },
});
