import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Picker 사용
import { LinearGradient } from "expo-linear-gradient"; // 그라디언트 라이브러리

export default function AlarmSettingsPage({ navigation }) {
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedAmPm, setSelectedAmPm] = useState("am");
  const [selectedDays, setSelectedDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]); // 요일 상태
  const [isEverydayChecked, setIsEverydayChecked] = useState(false); // 매일 체크박스 상태

  const toggleDaySelection = (index) => {
    const updatedDays = [...selectedDays];
    updatedDays[index] = !updatedDays[index];
    setSelectedDays(updatedDays);
  };

  const toggleEverydayCheckbox = () => {
    const newCheckedState = !isEverydayChecked;
    setIsEverydayChecked(newCheckedState);
    setSelectedDays(
      newCheckedState
        ? [true, true, true, true, true, true, true]
        : [false, false, false, false, false, false, false]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/backIcon.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>알림설정</Text>
        <Image
          source={require("../assets/trashIcon.png")}
          style={styles.icon}
        />
      </View>

      <Text style={styles.alarmTitle}>알림 설정</Text>
      <Text style={styles.alarmDescription}>
        푸시 알림을 받을 시각과 요일을 설정해주세요.
      </Text>

      {/* 시계 */}
      <View style={styles.timePickerContainer}>
        <View style={styles.timePickerMainRow}>
          {/* Picker 수정된 부분 */}
          <Picker
            selectedValue={selectedHour}
            onValueChange={(itemValue) => setSelectedHour(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
            ))}
          </Picker>
          <Text style={styles.colonText}>:</Text>
          <Picker
            selectedValue={selectedMinute}
            onValueChange={(itemValue) => setSelectedMinute(itemValue)}
            style={styles.picker}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={`${i}`} value={`${i}`} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedAmPm}
            onValueChange={(itemValue) => setSelectedAmPm(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="am" value="am" />
            <Picker.Item label="pm" value="pm" />
          </Picker>
        </View>
      </View>

      {/* 요일 반복 설정 */}
      <Text style={styles.repeatLabel}>요일반복</Text>

      {/* 체크박스와 "매일" 텍스트 */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, isEverydayChecked && styles.checkedCheckbox]}
          onPress={toggleEverydayCheckbox}
        >
          {/* 이미지로 체크박스 커스텀 */}
          {isEverydayChecked && (
            <Image
              source={require("../assets/checkBox.png")}
              style={styles.checkImage}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.dailyText}>매일</Text>
      </View>

      {/* 요일 선택 */}
      <View style={styles.daysContainer}>
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCircle,
              selectedDays[index] ? styles.enabledDay : styles.disabledDay,
            ]}
            onPress={() => toggleDaySelection(index)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDays[index] ? styles.enabledText : styles.disabledText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 확인 버튼 */}
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#79BA7E", "#AFCA85"]}
        style={styles.confirmButton}
      >
        <TouchableOpacity
          onPress={() => {
            /* 알림 설정 로직 추가 */
          }}
        >
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 30,
    paddingBottom: 68,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    color: "#242424",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  alarmTitle: {
    color: "#242424",
    fontSize: 18,
    marginBottom: 9,
    marginLeft: 25,
  },
  alarmDescription: {
    color: "#555555",
    fontSize: 14,
    marginBottom: 22,
    marginLeft: 25,
  },
  timePickerContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 27,
    marginBottom: 31,
  },
  timePickerMainRow: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#FBFBFB",
    paddingTop: 14,
    paddingBottom: 4,
    marginBottom: 4,
  },
  picker: {
    width: 89,
  },
  colonText: {
    color: "#242424",
    fontSize: 22,
    marginTop: 95,
  },
  repeatLabel: {
    color: "#242424",
    fontSize: 16,
    marginBottom: 16,
    marginLeft: 25,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
    marginBottom: 20,
  },
  checkbox: {
    width: 18,
    height: 18,
    backgroundColor: "#EFEFEF",
    borderRadius: 4,
    marginRight: 9,
    justifyContent: "center", // 세로 중앙 정렬
    alignItems: "center", // 가로 중앙 정렬
  },
  checkedCheckbox: {
    backgroundColor: "#79BA7E",
  },
  checkImage: {
    width: 12,
    height: 8,
  },
  dailyText: {
    fontSize: 14,
    color: "#242424",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginHorizontal: 23,
  },
  dayCircle: {
    width: 37,
    alignItems: "center",
    borderRadius: 46,
    paddingVertical: 11,
  },
  enabledDay: {
    backgroundColor: "#78BA7D",
  },
  disabledDay: {
    backgroundColor: "#EFEFEF",
  },
  dayText: {
    fontSize: 16,
  },
  enabledText: {
    color: "#FFFFFF",
  },
  disabledText: {
    color: "#8B8B8B",
  },
  confirmButton: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 21,
    marginHorizontal: 24,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

// import React, { useState } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient"; // 그라디언트 라이브러리

// export default function AlarmSettingsPage({ navigation }) {
//   const [selectedHour, setSelectedHour] = useState("12");
//   const [selectedMinute, setSelectedMinute] = useState("30");
//   const [selectedAmPm, setSelectedAmPm] = useState("am");
//   const [selectedDays, setSelectedDays] = useState([false, false, false, false, false, false, false]); // 요일 상태

//   const toggleDaySelection = (index) => {
//     const updatedDays = [...selectedDays];
//     updatedDays[index] = !updatedDays[index];
//     setSelectedDays(updatedDays);
//   };

//   const renderTimeOptions = (start, end, selected, setSelected) => {
//     const options = [];
//     for (let i = start; i <= end; i++) {
//       const value = i < 10 ? `0${i}` : `${i}`;
//       options.push(
//         <TouchableOpacity
//           key={i}
//           onPress={() => setSelected(value)}
//           style={[
//             styles.timeOption,
//             selected === value && styles.selectedTimeOption,
//           ]}
//         >
//           <Text
//             style={[
//               styles.timeText,
//               selected === value && styles.selectedTimeText,
//             ]}
//           >
//             {value}
//           </Text>
//         </TouchableOpacity>
//       );
//     }
//     return options;
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* 상단 헤더 */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButton}>{"<"}</Text>
//         </TouchableOpacity>
//         <Text style={styles.title}>알림설정</Text>
//         <TouchableOpacity>
//           <Text style={styles.deleteButton}>삭제</Text>
//         </TouchableOpacity>
//       </View>

//       {/* 설명 텍스트 */}
//       <Text style={styles.alarmTitle}>알림 설정</Text>
//       <Text style={styles.alarmDescription}>
//         푸시 알림을 받을 시각과 요일을 설정해주세요.
//       </Text>

//       {/* 시간 선택기 */}
//       <View style={styles.timePickerContainer}>
//         <View style={styles.timePickerMainRow}>
//           {/* 시간 선택 */}
//           <ScrollView style={styles.timePickerScroll} horizontal={false}>
//             {renderTimeOptions(1, 12, selectedHour, setSelectedHour)}
//           </ScrollView>

//           {/* 구분자 */}
//           <Text style={styles.colonText}>:</Text>

//           {/* 분 선택 */}
//           <ScrollView style={styles.timePickerScroll} horizontal={false}>
//             {renderTimeOptions(0, 59, selectedMinute, setSelectedMinute)}
//           </ScrollView>

//           {/* AM/PM 선택 */}
//           <ScrollView style={styles.timePickerScroll} horizontal={false}>
//             {["am", "pm"].map((value) => (
//               <TouchableOpacity
//                 key={value}
//                 onPress={() => setSelectedAmPm(value)}
//                 style={[
//                   styles.timeOption,
//                   selectedAmPm === value && styles.selectedTimeOption,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.timeText,
//                     selectedAmPm === value && styles.selectedTimeText,
//                   ]}
//                 >
//                   {value}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       </View>

//       {/* 요일 반복 설정 */}
//       <Text style={styles.repeatLabel}>요일반복</Text>
//       <View style={styles.daysContainer}>
//         {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[
//               styles.dayCircle,
//               selectedDays[index] ? styles.enabledDay : styles.disabledDay,
//             ]}
//             onPress={() => toggleDaySelection(index)}
//           >
//             <Text
//               style={[
//                 styles.dayText,
//                 selectedDays[index] ? styles.enabledText : styles.disabledText,
//               ]}
//             >
//               {day}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* 확인 버튼 */}
//       <LinearGradient
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0, y: 1 }}
//         colors={["#79BA7E", "#AFCA85"]}
//         style={styles.confirmButton}
//       >
//         <TouchableOpacity onPress={() => { /* 알림 설정 로직 추가 */ }}>
//           <Text style={styles.confirmButtonText}>확인</Text>
//         </TouchableOpacity>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// }

// // 스타일 정의
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingTop: 30,
//     paddingBottom: 68,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 18,
//     paddingHorizontal: 24,
//     marginBottom: 24,
//   },
//   title: {
//     color: "#242424",
//     fontSize: 16,
//     flex: 1,
//     textAlign: "center",
//   },
//   alarmTitle: {
//     color: "#242424",
//     fontSize: 18,
//     marginBottom: 9,
//     marginLeft: 25,
//   },
//   alarmDescription: {
//     color: "#555555",
//     fontSize: 14,
//     marginBottom: 22,
//     marginLeft: 25,
//   },
//   timePickerContainer: {
//     backgroundColor: "#FBFBFB",
//     paddingVertical: 27,
//     marginBottom: 31,
//   },
//   timePickerMainRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   timePickerScroll: {
//     height: 200,
//     width: 60,
//   },
//   timeOption: {
//     paddingVertical: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   selectedTimeOption: {
//     backgroundColor: "#D5EAD7",
//   },
//   timeText: {
//     fontSize: 22,
//     color: "#242424",
//   },
//   selectedTimeText: {
//     fontWeight: "bold",
//     color: "#79BA7E",
//   },
//   colonText: {
//     fontSize: 30,
//     color: "#242424",
//     paddingHorizontal: 10,
//   },
//   repeatLabel: {
//     color: "#242424",
//     fontSize: 16,
//     marginBottom: 16,
//     marginLeft: 25,
//   },
//   daysContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 24,
//     marginHorizontal: 23,
//   },
//   dayCircle: {
//     width: 37,
//     alignItems: "center",
//     borderRadius: 46,
//     paddingVertical: 11,
//   },
//   enabledDay: {
//     backgroundColor: "#78BA7D",
//   },
//   disabledDay: {
//     backgroundColor: "#EFEFEF",
//   },
//   dayText: {
//     fontSize: 16,
//   },
//   enabledText: {
//     color: "#FFFFFF",
//   },
//   disabledText: {
//     color: "#8B8B8B",
//   },
//   confirmButton: {
//     alignItems: "center",
//     borderRadius: 16,
//     paddingVertical: 21,
//     marginHorizontal: 24,
//   },
//   confirmButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//   },
// });
