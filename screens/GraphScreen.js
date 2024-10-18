import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { theme } from "../colors/color";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useRef, useMemo } from "react";
import { WithLocalSvg } from "react-native-svg/css";
import Left from "../assets/chevron_left.svg";
import Right from "../assets/chevron_right.svg";
import RightGray from "../assets/chevron_right_gray.svg";
import Y from "../assets/axisY.svg";
import Svg, { Line, Polyline, Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// import { BlurView } from "expo-blur";
import { VictoryPie } from "victory-native";
// import { PieChart } from "react-native-svg-charts";

export default function GraphScreen({ ipnumber, user_code, setIsCalendar }) {
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Seoul",
  });
  const symptomList = [
    "불순응",
    "반항",
    "떼쓰기",
    "자기연민성",
    "부정적인발언",
    "꾀병",
    "조르기",
    "끼어들기",
    "학교성적부진",
    "읽기능력부진",
    "주의력결핍",
    "무기력",
    "빈둥거리기",
    "고자질",
    "가족과다툼",
    "공격성",
    "거짓말",
  ];
  const [isWeek, setIsWeek] = useState(true); // 주간/월간 구분
  const [week, setWeek] = useState([]);
  const [weekNumber, setWeekNumber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date(today)); // 현재 기준이 되는 날짜
  const [dayState_week, setDayState_week] = useState([0, 0, 1, 2, 2, null, 1]);
  const [dayState_month, setDayState_month] = useState([0]);
  const [beforeSelectedWeek, setBeforeSelectedWeek] = useState(new Date(today));
  const [symptomCount, setSymptomCount] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [stateCount, setStateCount] = useState([0, 0, 0]);
  const previousWeek = useRef(week); // 변경 전 주
  const [weekStateNull, setWeekStateNull] = useState(false); // 주간 기록이 없을때 확인

  useEffect(() => {
    const start = async () => {
      await monthLoad();
    };
    start();
  }, []);

  useEffect(() => {
    // 선택 날짜로 주차 초기화
    const { weekDates, weekOfMonth } = getCurrentWeek(new Date(selectedDate));
    setWeek(weekDates);
    setWeekNumber(weekOfMonth);

    // selectedDate 월이 변할때
    if (beforeSelectedWeek.getMonth() !== selectedDate.getMonth()) {
      monthLoad();
    }
    previousWeek.current = weekDates;
    setBeforeSelectedWeek(selectedDate);

    console.log("선택날짜: ", selectedDate);
  }, [selectedDate]);

  // 월간 state 바꼈을때 월간 state count
  useEffect(() => {
    getStateCount();
  }, [dayState_month]);

  // 주 날짜 바꼈을때 주간 state 로드
  useEffect(() => {
    weekLoad();
  }, [week]);

  // 주간 state 로드
  const weekLoad = async () => {
    try {
      const requests = week.map((wek) =>
        axios.get(`http://${ipnumber}:8080/daily/records/${user_code}/${wek}`)
      );

      // 모든 요청이 완료될 때까지 대기
      const responses = await Promise.all(requests);
      const newDayStateWeek = responses.map((response) => {
        return response.data && response.data.state !== undefined
          ? response.data.state
          : null;
      });

      //console.log("주간 state : ", newDayStateWeek);

      // 모든 값이 null인지 확인
      const allNull = newDayStateWeek.every((state) => state === null);

      if (allNull) {
        setWeekStateNull(true);
      } else {
        setWeekStateNull(false);
      }

      setDayState_week(newDayStateWeek);
    } catch (error) {
      console.log("week 로드 실패 : ", error);
    }
  };

  // 월간 로드
  const monthLoad = async () => {
    try {
      const yearMonth = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}`;

      // 월간 state, 증상 로드(병렬)
      const [response_state, response_symptomCheck] = await Promise.all([
        await axios.get(
          `http://${ipnumber}:8080/daily/state/${user_code}/${yearMonth}`
        ),
        await axios.get(
          `http://${ipnumber}:8080/sx/frequency/${user_code}/${yearMonth}`
        ),
      ]);

      // dayState_month 초기화
      const monthDays = 31;
      const newDayStateMonth = Array(monthDays).fill(null);

      response_state.data.forEach((item) => {
        const day = new Date(item.date).getDate(); // 일(day) 값 추출
        newDayStateMonth[day - 1] = item.state; // 해당 인덱스에 state 값 할당
      });
      //console.log(newDayStateMonth);
      setDayState_month(newDayStateMonth);

      // symptomCount 초기화
      const newSymptomCount = Array(symptomList.length).fill(0);
      symptomList.forEach((symptom, index) => {
        if (symptom === "자기연민성") symptom = "자기연민성발언";

        response_symptomCheck.data.forEach((item) => {
          if (item.checklist_item === symptom) {
            newSymptomCount[index] = item.frequency;
          }
        });
      });
      //console.log(newSymptomCount);
      setSymptomCount(newSymptomCount);
    } catch (error) {
      console.log("month 로드 실패: ", error);
    }
  };

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

    return { weekDates, weekOfMonth };
  };

  // 주 이동
  const moveWeek = (where) => {
    const newDate = new Date(selectedDate);

    if (isWeek) {
      newDate.setDate(selectedDate.getDate() + where * 7); // 7일씩 이동
    } else {
      newDate.setMonth(selectedDate.getMonth() + where * 1); // 한 달 이동
    }

    setSelectedDate(newDate);
  };

  // 다음 주/달이 미래인지 확인
  const nextIsFuture = () => {
    const newDate = new Date(selectedDate);

    // 이동하려는 날짜
    if (isWeek) {
      newDate.setDate(selectedDate.getDate() + 7); // 7일씩 이동
    } else {
      newDate.setMonth(selectedDate.getMonth() + 1); // 한 달 이동
    }

    // 미래로 이동하는지 확인
    const futureDate = new Date(today);

    if (isWeek) {
      const futureWeek = getCurrentWeek(newDate).weekDates;
      const todayWeek = getCurrentWeek(futureDate).weekDates;

      if (new Date(futureWeek[0]) > new Date(todayWeek[0])) {
        return true;
      } else {
        return false;
      }
    } else {
      futureDate.setMonth(futureDate.getMonth() + 1);
      futureDate.setDate(1);

      if (newDate > futureDate) {
        return true;
      } else return false;
    }
  };

  // 주간 꺾은선 그래프(null을 기준으로 데이터를 분할)
  const draw_weekSegments = () => {
    const segments = [];
    let currentSegment = [];

    dayState_week.forEach((value, index) => {
      if (value === null) {
        if (currentSegment.length > 0) {
          segments.push([...currentSegment]);
          currentSegment = [];
        }
      } else {
        // x 36,24에서 수정
        currentSegment.push({ x: index * 37 + 13, y: 132 - value * 64 });
      }
    });

    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }

    return segments;
  };

  // 월간 꺾은선 그래프(null 무시)
  const draw_monthSegments = () => {
    const segments = [];

    dayState_month.forEach((value, index) => {
      if (value !== null) {
        segments.push({ x: index * 8 + 16, y: 132 - value * 64 });
      }
    });

    return segments.length === 0 ? null : [segments];
  };
  const monthSegments = useMemo(() => draw_monthSegments(), [dayState_month]);

  const drawSmoothPath = (points) => {
    if (points.length < 2) return "";

    let path = `M ${points[0].x},${points[0].y}`; // Move to the first point

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];

      const cp1x = p0.x + (p1.x - p0.x) / 10;
      const cp1y = p0.y;
      const cp2x = p1.x - (p1.x - p0.x) / 10;
      const cp2y = p1.y;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
    }

    return path;
  };

  // 원 그래프 데이터(최고, 보통, 아쉬움)
  const pieData = [
    { count: stateCount[0], color: theme.green },
    {
      count: stateCount[1],
      color: theme.yellow,
    },
    { count: stateCount[2], color: theme.pink },
  ];
  const chartData = pieData
    .filter((slice) => slice.count > 0)
    .map((slice, index) => ({
      value: slice.count,
      svg: {
        fill: slice.color, // 각 섹션의 색상 설정
        stroke: theme.grey500, // 경계선 색상
        strokeWidth: 1, // 경계선 두께
      },
      key: `pie-${index}`, // 고유한 키
    }));
  const data = () => {
    let totalCount = stateCount[0] + stateCount[1] + stateCount[2];

    if (totalCount == 0) totalCount = 1;

    return [
      { x: " ", y: (stateCount[0] / totalCount) * 100 },

      {
        x: " ",
        y: (stateCount[1] / totalCount) * 100,
      },
      { x: " ", y: (stateCount[2] / totalCount) * 100 },
    ];
  };

  // 원 그래프 레이블/데이터 컴포넌트
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
        <Text style={{ ...styles.title, color: theme.grey800 }}>{count}</Text>
        <Text
          style={{
            ...styles.title,
            color: theme.grey500,
            fontFamily: "Pretendard-Regular",
          }}
        >
          /{stateCount[0] + stateCount[1] + stateCount[2]}
        </Text>
      </View>
    </View>
  );

  // 원 그래프 증상결과 카운트
  const getStateCount = () => {
    const newStateCount = [0, 0, 0]; // 최고, 보통, 아쉬움

    dayState_month.forEach((state) => {
      if (state === 2) {
        newStateCount[0]++;
      } else if (state === 1) {
        newStateCount[1]++;
      } else if (state == 0) {
        newStateCount[2]++;
      }
    });

    setStateCount(newStateCount);
  };

  const isNextFuture = nextIsFuture();

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setIsCalendar(true)}
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
              {isWeek
                ? `${selectedDate.getMonth() + 1}월 ${weekNumber}주차`
                : `${selectedDate.getFullYear()}년 ${
                    selectedDate.getMonth() + 1
                  }월`}
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              disabled={isNextFuture}
              onPress={() => moveWeek(1)}
            >
              {isNextFuture ? (
                <WithLocalSvg asset={RightGray} />
              ) : (
                <WithLocalSvg asset={Right} />
              )}
            </TouchableOpacity>
          </View>
          {/* 꺾은선 그래프 */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 블러 처리 */}
            {((!isWeek && !monthSegments) || (isWeek && weekStateNull)) && (
              <ImageBackground
                source={require("../assets/NoData11.png")}
                style={styles.absolute}
                resizeMode="cover"
              >
                {/* <Text style={styles.noDataText}>기록된 내용이 없어요</Text>
                <Text style={styles.noDataText}>
                  하루기록으로 증상을 체크해주세요!
                </Text> */}
              </ImageBackground>
              // <BlurView intensity={100} style={styles.overlay}>
              //   <Text style={styles.noDataText}>기록된 내용이 없어요</Text>
              //   <Text style={styles.noDataText}>
              //     하루기록으로 증상을 체크해주세요!
              //   </Text>
              // </BlurView>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: 288,
                marginBottom: 24,
              }}
            >
              {/* y축 */}
              <View style={{ marginLeft: 4 }}>
                <WithLocalSvg asset={Y} />
              </View>
              {/* 그래프 */}
              <Svg
                height="148"
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
                {/* 주간 그래프 */}
                {isWeek
                  ? draw_weekSegments().map((segment, index) => {
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
                    })
                  : null}
                {isWeek
                  ? dayState_week.map((value, index) => {
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
                    })
                  : null}
                {/* 월간 그래프 */}
                {!isWeek && monthSegments
                  ? monthSegments.map((segment, index) => {
                      const path = drawSmoothPath(segment);
                      return (
                        <Polyline
                          key={index}
                          d={path}
                          fill="none"
                          stroke={theme.green500}
                          strokeWidth="2"
                        />
                      );
                    })
                  : null}
                {!isWeek
                  ? dayState_month.map((value, index) => {
                      if (value !== null) {
                        return (
                          <Circle
                            key={index}
                            cx={index * 8 + 16}
                            cy={132 - value * 64}
                            r="1"
                            fill={theme.green500}
                          />
                        );
                      }
                      return null;
                    })
                  : null}
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
              {/* 주간 날짜 */}
              {isWeek &&
                week.map((day, index) => (
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
              {/* 월간 날짜 */}
              {!isWeek &&
                [1, 8, 15, 22, 28].map((day, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 53,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.s_text,
                        fontFamily: "Pretendard-Medium",
                      }}
                    >
                      {selectedDate.getMonth() + 1}.{day}
                    </Text>
                  </View>
                ))}
            </View>
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
          {/* 블러 처리 */}
          {!monthSegments && (
            <ImageBackground
              source={require("../assets/NoData22.png")}
              style={styles.absolute}
              resizeMode="contain"
            >
              {/* <Text style={styles.noDataText}>기록된 내용이 없어요</Text>
              <Text style={styles.noDataText}>
                하루기록으로 증상을 체크해주세요!
              </Text> */}
            </ImageBackground>
            // <BlurView intensity={100} style={styles.absolute}>
            //   <Text style={styles.noDataText}>기록된 내용이 없어요</Text>
            //   <Text style={styles.noDataText}>
            //     하루기록으로 증상을 체크해주세요!
            //   </Text>
            // </BlurView>
          )}
          <View style={styles.rowContainer}>
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: theme.grey500,
                justifyContent: "center",
                alignItems: "center",
                padding: 9,
                margin: 4,
              }}
            >
              {/* <PieChart
                style={{ height: 90, width: 90 }}
                data={chartData}
                innerRadius={0}
                padAngle={0}
                outerRadius={"99%"}
              /> */}
              <VictoryPie
                data={data()}
                colorScale={[theme.green, theme.yellow, theme.pink]}
                innerRadius={0}
                labels={() => null}
                padAngle={0}
                style={{
                  data: {
                    stroke: theme.grey500,
                    strokeWidth:
                      stateCount.filter((value) => value === 0).length >= 2
                        ? 0
                        : 1,
                  },
                }}
                width={
                  stateCount.filter((value) => value === 0).length >= 2
                    ? 188
                    : 190
                }
                height={190}
                animate={{
                  duration: 500,
                  easing: "exp",
                }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 24 }}>
              <PieLabel
                label={"최고"}
                count={stateCount[0]}
                color={theme.green}
              />
              <PieLabel
                label={"보통"}
                count={stateCount[1]}
                color={theme.yellow}
              />
              <PieLabel
                label={"아쉬움"}
                count={stateCount[2]}
                color={theme.pink}
              />
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
              <Text style={styles.s_text}>
                총 {stateCount[0] + stateCount[1] + stateCount[2]}일
              </Text>
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
        <View style={styles.subContainer}>
          {!monthSegments && (
            <ImageBackground
              source={require("../assets/NoData33.png")}
              style={styles.absolute}
              resizeMode="contain"
            >
              {/* <Text style={styles.noDataText}>기록된 내용이 없어요</Text>
              <Text style={styles.noDataText}>
                하루기록으로 증상을 체크해주세요!
              </Text> */}
            </ImageBackground>
            // <BlurView intensity={100} style={styles.absolute}>
            //   <Text style={styles.noDataText}>기록된 내용이 없어요</Text>
            //   <Text style={styles.noDataText}>
            //     하루기록으로 증상을 체크해주세요!
            //   </Text>
            // </BlurView>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* 바 그래프 */}
            {symptomList.map((symptom, index) => (
              <View key={index} style={styles.barContainer}>
                <Text style={{ ...styles.barText, marginBottom: 4 }}>
                  {symptomCount[index]}회
                </Text>
                <LinearGradient
                  colors={["#79BA7E", "#AFCA85"]}
                  style={[styles.bar, { height: 11 * symptomCount[index] }]}
                />
                <View style={{ ...styles.line, marginBottom: 8 }} />
                <View style={styles.Keyword}>
                  <Text style={{ ...styles.barText, color: theme.green800 }}>
                    {symptom}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
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
  noDataText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Pretendard-Medium",
    color: theme.grey800,
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
  barContainer: {
    width: 96,
    height: 170,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barText: {
    fontSize: 12,
    lineHeight: 20,
    color: theme.grey600,
    fontFamily: "Pretendard-Medium",
  },
  bar: {
    width: 30,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  Keyword: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 24,
    backgroundColor: theme.green100,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
