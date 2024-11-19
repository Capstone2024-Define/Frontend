import axios from "axios";
import { NAVER_API_KEY } from "@env";

const CLIENT_ID = "mmph2r39xw";

const summary = async (text) => {
  const url = "https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize";
  const headers = {
    "X-NCP-APIGW-API-KEY-ID": CLIENT_ID,
    "X-NCP-APIGW-API-KEY": NAVER_API_KEY,
    "Content-Type": "application/json",
  };

  // 요청 바디(document, option)
  // tone : 0(원문 어투 유지), 1(해요체 변환), 2(정중체 변환), 3(음슴체?)
  const data = {
    document: {
      title: "",
      content: text,
    },
    option: {
      language: "ko",
      model: "general",
      tone: 0,
      summaryCount: 3,
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error summaryRequest:", error);
    throw error;
  }
};

export default summary;
