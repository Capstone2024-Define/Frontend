import axios from "axios";

const API_KEY =
  "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";
const MODEL = "gpt-3.5-turbo";

const summarize = async (text) => {
  try {
    // fetch 방법
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: MODEL,
    //     messages: [{ role: "user", content: `${text}를 90자 이내로 요약해줘` }],
    //     max_tokens: 200,
    //     temperature: 0.7,
    //   }),
    // });

    // const data = await response.json();
    // return data.choices[0].message.content.trim();

    // axios 방법
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: MODEL,

        messages: [
          {
            role: "user",
            content: `${text}를 80자 이내로 요약해줘.`,
          },
        ],
        max_tokens: 200, // 요약 결과의 길이를 제한
        temperature: 0.8, // 출력의 창의성 정도를 조절
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    //console.log(response);
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching summary:", error);
    return "요약을 생성하는 데 실패했습니다.";
  }
};

export default summarize;
