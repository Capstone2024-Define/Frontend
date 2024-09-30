import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { WithLocalSvg } from "react-native-svg/css";
import Left from "../assets/chevron_left.svg";
import Right from "../assets/chevron_right.svg";

export default function StatisticsScreen({ setState }) {
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  const [isWeek, setIsWeek] = useState(true); // 주간/월간 구분
  const [week, setWeek] = useState([]);
  const [weekNumber, setWeekNumber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(today)); // 현재 기준이 되는 날짜

  useEffect(() => {
    // 선택 날짜로 주차 초기화
    const { weekDates, weekOfMonth } = getCurrentWeek(new Date(selectedDate));
    setWeek(weekDates);
    setWeekNumber(weekOfMonth);
  }, [selectedDate]);

  // 현재 날짜의 주 날짜, 주차 계산
  const getCurrentWeek = (date) => {
    const currentDay = date.getDay();
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - currentDay); // 해당 주의 일요일

    // 주간의 날짜 배열을 반환
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startDate);
      weekDay.setDate(startDate.getDate() + i);
      weekDates.push(
        weekDay.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" })
      );
    }

    // 해당 월의 몇 주차인지 계산
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const weekOfMonth = Math.ceil((date.getDate() + startOfMonth.getDay()) / 7);

    console.log(weekDates);
    console.log(weekOfMonth);

    return { weekDates, weekOfMonth };
  };

  const moveWeek = (where) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + where * 7); // 7일씩 이동
    setSelectedDate(newDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setState(false)}
            style={styles.headerTab}
          >
            <Text style={{ ...styles.subTitle, color: theme.grey300 }}>
              캘린더
            </Text>
          </TouchableOpacity>
          <View style={{ height: 4, backgroundColor: theme.grey150 }} />
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={0.5} style={styles.headerTab}>
            <Text style={{ ...styles.subTitle, color: theme.green500 }}>
              통계
            </Text>
          </TouchableOpacity>
          <LinearGradient colors={["#79BA7E", "#AFCA85"]}>
            <View style={{ height: 4, backgroundColor: "transperent" }} />
          </LinearGradient>
        </View>
      </View>
      {/* 그래프 */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={{ ...styles.title, marginBottom: 4 }}>
          증상체크 그래프
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={styles.s_text}>
            증상체크 결과 추이를 그래프로 확인해보세요.
          </Text>
          <Text style={styles.m_text}>
            {new Date(week[0]).getMonth() + 1}.{new Date(week[0]).getDate()}~
            {new Date(week[6]).getMonth() + 1}.{new Date(week[6]).getDate()}
          </Text>
        </View>
        <View style={styles.subContainer}>
          <View
            style={{
              ...styles.rowContainer,
              paddingVertical: 4,
              paddingHorizontal: 2,
              marginBottom: 16,
              borderRadius: 8,
              backgroundColor: theme.grey150,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setIsWeek(true)}
              style={[
                styles.button,
                !isWeek && { backgroundColor: theme.grey150 },
              ]}
            >
              <Text
                style={[
                  styles.subTitle,
                  isWeek
                    ? { color: theme.green500 }
                    : {
                        color: theme.grey300,
                        fontFamily: "Pretendard-Regular",
                      },
                ]}
              >
                주간
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setIsWeek(false)}
              style={[
                styles.button,
                isWeek && { backgroundColor: theme.grey150 },
              ]}
            >
              <Text
                style={[
                  styles.subTitle,
                  !isWeek
                    ? { color: theme.green500 }
                    : {
                        color: theme.grey300,
                        fontFamily: "Pretendard-Regular",
                      },
                ]}
              >
                월간
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ ...styles.rowContainer, marginBottom: 16 }}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => moveWeek(-1)}>
              <WithLocalSvg asset={Left} />
            </TouchableOpacity>
            <Text style={{ ...styles.title, fontFamily: "Pretendard-Medium" }}>
              {selectedDate.getMonth() + 1}월 {weekNumber}주차
            </Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => moveWeek(1)}>
              <WithLocalSvg asset={Right} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 8,
    backgroundColor: "white",
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    height: 40,
  },
  headerTab: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: theme.grey100,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Pretendard-Bold",
    color: theme.grey800,
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Bold",
  },
  m_text: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
    color: theme.grey600,
  },
  s_text: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Pretendard-Regular",
    color: theme.grey600,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 2,
    borderRadius: 8,
    backgroundColor: "white",
  },
});
