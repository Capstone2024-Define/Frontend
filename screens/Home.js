import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { FontFamily, Color, FontSize, Border } from "../GlobalStyles";

const Frame = () => {
  return (
    <View style={styles.view}>
      <View style={styles.groupParent}>
        <View style={styles.parent}>
          <Text style={styles.text}>홈</Text>
          <Image
            style={[styles.groupChild, styles.groupLayout]}
            contentFit="cover"
            source={require("../assets/ellipse-1.png")}
          />
        </View>
        <View style={[styles.group, styles.groupSpaceBlock]}>
          <Text style={[styles.text1, styles.textTypo2]}>정보</Text>
          <Image
            style={[styles.groupChild, styles.groupLayout]}
            contentFit="cover"
            source={require("../assets/ellipse-1.png")}
          />
        </View>
        <View style={[styles.container, styles.groupSpaceBlock]}>
          <Text style={[styles.text2, styles.text2Position]}>캘린더</Text>
          <Image
            style={[styles.groupInner, styles.groupLayout]}
            contentFit="cover"
            source={require("../assets/ellipse-1.png")}
          />
        </View>
        <View style={[styles.group, styles.groupSpaceBlock]}>
          <Text style={styles.text3}>마이</Text>
          <Image
            style={[styles.groupChild, styles.groupLayout]}
            contentFit="cover"
            source={require("../assets/ellipse-1.png")}
          />
        </View>
      </View>
      <View style={[styles.child, styles.text2Position]} />
      <View style={styles.wrapper}>
        <Text style={styles.text4}>오늘 우리 아이가 어땠는지 기록해주세요</Text>
      </View>
      <View style={[styles.item, styles.itemLayout]} />
      <View style={[styles.inner, styles.itemLayout]} />
      <View style={[styles.frameView, styles.parent1Position]}>
        <Text style={[styles.text5, styles.textTypo1]}>음성기록</Text>
        <Text style={[styles.text6, styles.textTypo]}>
          음성을 텍스트로 변환
        </Text>
      </View>
      <View style={[styles.parent1, styles.parent1Position]}>
        <Text style={[styles.text7, styles.textTypo1]}>하루 기록</Text>
        <Text style={[styles.text6, styles.textTypo]}>
          오늘 우리 아이를 기록해요
        </Text>
      </View>
      <View style={styles.frameParent}>
        <View style={[styles.parent2, styles.parentFlexBox]}>
          <Text style={[styles.text9, styles.textTypo]}>일</Text>
          <Text style={[styles.text9, styles.textTypo]}>월</Text>
          <Text style={[styles.text9, styles.textTypo]}>화</Text>
          <Text style={[styles.text9, styles.textTypo]}>수</Text>
          <Text style={[styles.text9, styles.textTypo]}>목</Text>
          <Text style={[styles.text9, styles.textTypo]}>금</Text>
          <Text style={[styles.text9, styles.textTypo]}>토</Text>
        </View>
        <View style={[styles.parent3, styles.parentFlexBox]}>
          <Text style={[styles.text16, styles.textTypo]}>9</Text>
          <Text style={[styles.text16, styles.textTypo]}>10</Text>
          <Text style={[styles.text16, styles.textTypo]}>11</Text>
          <Text style={[styles.text16, styles.textTypo]}>12</Text>
          <Text style={[styles.text16, styles.textTypo]}>13</Text>
          <Text style={[styles.text16, styles.textTypo]}>14</Text>
          <Text style={[styles.text16, styles.textTypo]}>15</Text>
        </View>
      </View>
      <Image
        style={[styles.groupIcon, styles.childIconLayout]}
        contentFit="cover"
        source={require("../assets/group-155.png")}
      />
      <Image
        style={[styles.child1, styles.childIconLayout]}
        contentFit="cover"
        source={require("../assets/group-155.png")}
      />
      <Image
        style={[styles.child2, styles.childIconLayout]}
        contentFit="cover"
        source={require("../assets/group-155.png")}
      />
      <View style={styles.rectangleView} />
      <Text style={[styles.text23, styles.text23Position]}>2024년 6월</Text>
      <Image
        style={[styles.calendarTodayIcon, styles.text23Position]}
        contentFit="cover"
        source={require("../assets/calendar-today.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  groupLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    bottom: "37.24%",
    top: "0%",
    height: "62.76%",
    position: "absolute",
    overflow: "hidden",
  },
  groupSpaceBlock: {
    marginLeft: 49,
    height: 48,
  },
  textTypo2: {
    fontFamily: FontFamily.pretendard,
    fontWeight: "500",
    textAlign: "center",
    color: Color.gray04,
    lineHeight: 16,
    fontSize: FontSize.size_xs,
    top: 32,
  },
  text2Position: {
    left: 0,
    position: "absolute",
  },
  itemLayout: {
    width: 321,
    backgroundColor: Color.colorGainsboro_100,
    borderRadius: Border.br_base,
    left: 14,
    position: "absolute",
  },
  parent1Position: {
    left: 33,
    position: "absolute",
  },
  textTypo1: {
    height: 16,
    lineHeight: 24,
    fontSize: FontSize.size_base,
    color: Color.colorGray,
    fontFamily: FontFamily.interBold,
    fontWeight: "700",
    letterSpacing: -0.4,
    textAlign: "left",
  },
  textTypo: {
    fontFamily: FontFamily.interRegular,
    lineHeight: 18,
    letterSpacing: -0.3,
    textAlign: "left",
    fontSize: FontSize.size_xs,
  },
  parentFlexBox: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  childIconLayout: {
    height: 24,
    width: 24,
  },
  text23Position: {
    top: 133,
    position: "absolute",
  },
  text: {
    left: 8,
    textAlign: "center",
    color: Color.gray04,
    fontFamily: FontFamily.arial,
    lineHeight: 16,
    fontSize: FontSize.size_xs,
    top: 32,
    position: "absolute",
  },
  groupChild: {
    right: "0%",
    left: "0%",
    width: "100%",
    maxHeight: "100%",
    maxWidth: "100%",
    bottom: "37.24%",
    top: "0%",
    height: "62.76%",
  },
  parent: {
    height: 48,
    width: 30,
  },
  text1: {
    left: 4,
    fontFamily: FontFamily.pretendard,
    fontWeight: "500",
    position: "absolute",
  },
  group: {
    width: 30,
    marginLeft: 49,
  },
  text2: {
    fontFamily: FontFamily.pretendard,
    fontWeight: "500",
    textAlign: "center",
    color: Color.gray04,
    lineHeight: 16,
    fontSize: FontSize.size_xs,
    top: 32,
  },
  groupInner: {
    width: "93.75%",
    right: "3.13%",
    left: "3.13%",
  },
  container: {
    width: 32,
  },
  text3: {
    textAlign: "left",
    left: 4,
    color: Color.gray04,
    fontFamily: FontFamily.arial,
    lineHeight: 16,
    fontSize: FontSize.size_xs,
    top: 32,
    position: "absolute",
  },
  groupParent: {
    marginLeft: -180,
    top: 715,
    left: "50%",
    borderColor: "#e2e2e2",
    borderTopWidth: 1,
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 0,
    flexDirection: "row",
    width: 360,
    position: "absolute",
    borderStyle: "solid",
  },
  child: {
    top: 0,
    borderBottomLeftRadius: 30,
    backgroundColor: "#d9d9d9",
    height: 123,
    width: 360,
    left: 0,
  },
  text4: {
    fontSize: 20,
    lineHeight: 30,
    color: Color.colorGray,
    fontFamily: FontFamily.interBold,
    fontWeight: "700",
    letterSpacing: -0.4,
    textAlign: "left",
  },
  wrapper: {
    top: 76,
    left: 29,
    position: "absolute",
  },
  item: {
    top: 275,
    height: 109,
  },
  inner: {
    top: 410,
    height: 107,
  },
  text5: {
    width: 58,
  },
  text6: {
    marginTop: 8,
    color: Color.colorGray,
  },
  frameView: {
    top: 427,
  },
  text7: {
    width: 75,
  },
  parent1: {
    top: 293,
  },
  text9: {
    color: Color.colorLightgray,
  },
  parent2: {
    width: 302,
  },
  text16: {
    color: Color.colorBlack,
  },
  parent3: {
    width: 306,
    marginTop: 6,
  },
  frameParent: {
    top: 166,
    left: 26,
    position: "absolute",
  },
  groupIcon: {
    left: 65,
    top: 219,
    width: 24,
    position: "absolute",
  },
  child1: {
    left: 18,
    top: 219,
    width: 24,
    position: "absolute",
  },
  child2: {
    left: 114,
    top: 219,
    width: 24,
    position: "absolute",
  },
  rectangleView: {
    top: 162,
    left: 209,
    borderRadius: 24,
    backgroundColor: "rgba(90, 90, 90, 0.5)",
    width: 33,
    height: 52,
    position: "absolute",
  },
  text23: {
    left: 20,
    lineHeight: 24,
    fontSize: FontSize.size_base,
    top: 133,
    color: Color.colorGray,
    fontFamily: FontFamily.interBold,
    fontWeight: "700",
    letterSpacing: -0.4,
    textAlign: "left",
  },
  calendarTodayIcon: {
    left: 111,
    height: 24,
    width: 24,
  },
  view: {
    backgroundColor: "#fff",
    borderColor: "#2d7500",
    borderWidth: 3,
    flex: 1,
    height: 800,
    overflow: "hidden",
    borderStyle: "solid",
    width: "100%",
  },
});

export default Frame;
