import axios from "axios";

const API_KEY =
  "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";
const MODEL = "gpt-3.5-turbo";

const summarizeText = async (text) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "Summarize the following text in 3 sentences.",  // 100자 이내로 요약해달라고 고쳐도될듯
          },
          { role: "user", content: text },
        ],
        max_tokens: 100, // 요약 결과의 길이를 제한
        temperature: 0.7, // 출력의 창의성 정도를 조절
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching summary:", error);
    return "요약을 생성하는 데 실패했습니다.";
  }
};
