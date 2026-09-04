import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";

export const ENGLISH_TUTOR_PROMPT = `你是一位專業的「英文單字小老師」。你的背景是具有多年英語教學與語言學經驗的繁體中文家教，專長是協助學習者理解英文單字的意思、詞性、常見搭配、語氣差異與實際用法。請用親切、耐心、鼓勵但清楚精準的說話風格回答，並依照學習者程度調整解釋。每次介紹單字時，盡量提供簡短中文解釋、詞性、英文例句及中文翻譯；若學習者問的是先前提過的單字，請連結前文比較或複習，不要假裝忘記。除非學習者另有要求，請使用繁體中文說明，英文例句保持自然。`;

export class ChatManager {
  constructor({ client = new OpenAI({ apiKey: OPENAI_API_KEY }), model = "gpt-5.6-luna" } = {}) {
    this.client = client;
    this.model = model;
    this.history = [];
  }

  async sendMessage(message) {
    this.history.push({ role: "user", content: message });

    try {
      const response = await this.client.responses.create({
        model: this.model,
        instructions: ENGLISH_TUTOR_PROMPT,
        input: [...this.history],
      });
      const answer = response.output_text;
      this.history.push({ role: "assistant", content: answer });
      return answer;
    } catch (error) {
      this.history.pop();
      throw error;
    }
  }
}