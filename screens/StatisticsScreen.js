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
import Svg, { Line, Polyline, Circle } from "react-native-svg";
import { PieChart } from "react-native-chart-kit";

export default function StatisticsScreen({ setState }) {
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  const [isWeek, setIsWeek] = useState(true); // 주간/월간 구분
  const [week, setWeek] = useState([]);
  const [weekNumber, setWeekNumber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(today)); // 현재 기준이 되는 날짜
  const [dayState, setDayState] = useState([0, 0, 1, 2, 2, null, 1]);
  const [segments, setSegments] = useState([]);

  useEffect(() => {
    // 선택 날짜로 주차 초기화
    const { weekDates, weekOfMonth } = getCurrentWeek(new Date(selectedDate));
    setWeek(weekDates);
    setWeekNumber(weekOfMonth);

    // !!dayState 업데이트 구현예정
  }, [selectedDate]);

  useEffect(() => {
    // 꺾은선 그래프 변경
    dayStateSegments();
  }, [dayState]);

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

  // 주 이동
  const moveWeek = (where) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + where * 7); // 7일씩 이동
    setSelectedDate(newDate);
  };

  // null을 기준으로 데이터를 분할(꺾은선 그래프)
  const dayStateSegments = () => {
    const newSegments = [];
    let currentSegment = [];

    dayState.forEach((value, index) => {
      if (value === null) {
        if (currentSegment.length > 0) {
          newSegments.push([...currentSegment]);
          currentSegment = [];
        }
      } else {
        // x 36,24에서 수정
        currentSegment.push({ x: index * 37 + 13, y: 132 - value * 64 });
      }
    });

    if (currentSegment.length > 0) {
      newSegments.push(currentSegment);
    }

    setSegments(newSegments);
  };

  // 원 그래프 데이터
  const pieData = [
    { name: "Good", count: 10, color: theme.green, label: "최고" },
    { name: "Normal", count: 4, color: theme.yellow, label: "보통" },
    { name: "Bad", count: 1, color: theme.pink, label: "아쉬움" },
  ];

  // 원 그래프 레이블/데이터
  const PieLabel = ({ label, count, color }) => (
    <View style={styles.pieLabelContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{ ...styles.circle, backgroundColor: color, marginRight: 8 }}
        />
        <Text
          style={{
            ...styles.m_text,
            fontFamily: "Pretendard-Medium",
          }}
        >
          {label}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ ...styles.title, color: theme.green500 }}>{count}</Text>
        <Text
          style={{
            ...styles.title,
            color: theme.grey500,
            fontFamily: "Pretendard-Regular",
          }}
        >
          /15
        </Text>
      </View>
    </View>
  );

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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* 증상체크 그래프 */}
        <Text style={{ ...styles.title, marginBottom: 4 }}>
          증상체크 그래프
        </Text>
        <View style={styles.titleDetailContainer}>
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
          {/* 꺾은선 그래프 */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: 288,
              marginBottom: 27,
            }}
          >
            {/* y축 */}
            <View>
              <Text>
                세{"\n"}로{"\n"}축
              </Text>
            </View>
            {/* 그래프 */}
            <Svg
              height="138"
              width="254"
              style={{ marginTop: 11, backgroundColor: "white" }}
            >
              {/* x축 선 */}
              <Line
                x1="0"
                y1="132"
                x2="248"
                y2="132"
                stroke="#EBEBEB"
                strokeWidth="1"
              />
              <Line
                x1="0"
                y1="68"
                x2="248"
                y2="68"
                stroke="#EBEBEB"
                strokeWidth="1"
              />
              <Line
                x1="0"
                y1="4"
                x2="248"
                y2="4"
                stroke="#EBEBEB"
                strokeWidth="1"
              />
              {/* 꺾은 선 */}
              {segments.map((segment, index) => {
                const points = segment
                  .map((point) => `${point.x},${point.y}`)
                  .join(" ");
                return (
                  <Polyline
                    key={index}
                    points={points}
                    fill="none"
                    stroke={theme.green500}
                    strokeWidth="2"
                  />
                );
              })}
              {/* 점 */}
              {dayState.map((value, index) => {
                if (value !== null) {
                  return (
                    <Circle
                      key={index}
                      cx={index * 37 + 13}
                      cy={132 - value * 64}
                      r="3"
                      fill="white"
                      stroke={theme.green500}
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              })}
            </Svg>
          </View>
          <View style={styles.line} />
          {/* 날짜 */}
          <View
            style={{
              ...styles.rowContainer,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            {week.map((day, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 37,
                }}
              >
                <Text
                  style={{
                    ...styles.s_text,
                    fontFamily: "Pretendard-Medium",
                  }}
                >
                  {new Date(day).getMonth() + 1}.{new Date(day).getDate()}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {/* 증상체크 차트 */}
        <Text style={{ ...styles.title, marginTop: 20, marginBottom: 4 }}>
          증상체크 차트
        </Text>
        <View style={styles.titleDetailContainer}>
          <Text style={styles.s_text}>
            증상체크 결과의 단계별 비율을 확인해보세요.
          </Text>
          <Text style={styles.m_text}>
            {selectedDate.getMonth() + 1}.1~
            {selectedDate.getMonth() + 1}.
            {new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth() + 1,
              0
            ).getDate()}
          </Text>
        </View>
        {/* 원 차트 */}
        <View style={styles.subContainer}>
          <View style={styles.rowContainer}>
            <PieChart
              data={pieData}
              width={100}
              height={100}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              center={[25, 0]}
              accessor={"count"}
              backgroundColor={"transparent"}
              hasLegend={false}
            />
            <View style={{ flex: 1, marginLeft: 24 }}>
              <PieLabel label={"최고"} count={10} color={theme.green} />
              <PieLabel label={"보통"} count={4} color={theme.yellow} />
              <PieLabel label={"아쉬움"} count={1} color={theme.pink} />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: 163,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.s_text}>기록한 날짜</Text>
              <Text style={styles.s_text}>총 15일</Text>
            </View>
          </View>
        </View>
        {/* 증상체크 키워드 */}
        <Text style={{ ...styles.title, marginTop: 20, marginBottom: 4 }}>
          증상체크 주요 키워드
        </Text>
        <View style={styles.titleDetailContainer}>
          <Text style={styles.s_text}>
            증상체크에서 자주 선택한 키워드를 확인해보세요.
          </Text>
          <Text style={styles.m_text}>
            {selectedDate.getMonth() + 1}.1~
            {selectedDate.getMonth() + 1}.
            {new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth() + 1,
              0
            ).getDate()}
          </Text>
        </View>
        <View style={{ height: 40 }} />
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
  titleDetailContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pieLabelContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
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
  line: {
    width: "100%",
    height: 1,
    backgroundColor: theme.grey300,
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.grey500,
  },
});
