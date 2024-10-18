// infos의 인덱스가 key값이 될 예정(ex. infos[0] => 여기서 0이 key값)
// 더 좋은거 생각나면 알려주세요

export const infos = [
  {
    imageName: require("../assets/infoexe.png"),
    mainTitle: `ADHD 비약물 치료법`,
    title: "ADHD 비약물 치료법",
    summary: "시각적 자극 활용 및...",
    content: [
      [null, "치료의 첫 단계는~~"],
      ["행동치료", "보상, 칭찬, 모범 등 행동을 개선..."],
      ["코그메드 훈련", "PC 프로그램을 통한 훈련으로..."],
      ["뉴로피드백", "뇌파를 측정해 집중할 때..."],
      [null, "ADHD 증상이 고착화된 이후..."],
    ],
    tag: ["행당치료", "치료법"],
    origin: "강북 삼성병원 - 행복 진단정보",
  },
  {
    imageName: require("../assets/infoexe.png"),
    mainTitle: `초등학교 고학년 ADHD${"\n"}대표 증상`,
    title: `초등학교 고학년 ADHD 대표 증상`,
    summary: "초등학교 고학년이 되면...",
    content: [
      [null, "초등학교 고학년이 되면 공부의 양이 많아..."],
      [null, "특히 고학년이 되면 또래들의 사회성..."],
      [null, "게다가 ADHD로 인해 정서적인 문제를..."],
    ],
    tag: ["증상", "진단"],
    origin: "강북 삼성병원 - 행복 진단정보",
  },
  {
    imageName: require("../assets/infoexe.png"),
    mainTitle: `초등학생 ADHD${"\n"}검사 방법`,
    title: "초등학생 ADHD 검사 방법",
    summary: "초등학교 아동의 ADHD를 확인하기 위해서는 다양...",
    content: [
      [null, "초등학교 아동의 ADHD를 확인하기 위해서는..."],
      [
        "초기 평가",
        "부모와 교사 인터뷰:부모와 교사는 아동의...",
        "아동 행동 관찰: 아동이 수업 시간...",
      ],
      ["진단 도구", "주의력과 과잉 활동성 증상을 평가..."],
      [
        "부가적인 평가",
        "지능 검사: 아동의 학업적 능력과 지능을...",
        "학교 성취도 평가: 아동의 학업 성취도...",
      ],
      [null, "이러한 평가 과정을 통해 의사나 심리학..."],
    ],
    tag: ["증상", "진단"],
    origin: "강북 삼성병원 - 행복 진단정보",
  },
];

// // 타이틀
// <Text style={styles.title}>{info[key].title}</Text>
// // 이미지
// <Image source={require(info[key].imageName)} />
// // 요약
// <Text style={styles.summary}>{info[key].summary}</Text>
// // 내용
// info[key].content.map((index, content)=>{
//   <View key={index} style={styles.contentContainer}>
//     content[0] && <Text style={styles.subtitle}>{content[0]}</Text>
//     content[1] && <Text style={styles.text}>{content[1]}</Text>
//   </View>
// })
