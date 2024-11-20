import axios from "axios";
import { CHATGPT_API_KEY } from "@env";

const MODEL = "gpt-4o-mini";

const summarize = async (text) => {
  console.log(CHATGPT_API_KEY);
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
          Authorization: `Bearer ${CHATGPT_API_KEY}`,
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
