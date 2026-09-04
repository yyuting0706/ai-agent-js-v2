import { input } from "@inquirer/prompts";
import { ChatManager } from "./chat-manager.js";

const chatManager = new ChatManager();
console.log("英文單字小老師已上線！輸入 exit 或 quit 結束對話。\n");

while (true) {
  const userQuestion = await input({ message: "你：" });

  if (["exit", "quit"].includes(userQuestion.trim().toLowerCase())) {
    console.log("英文單字小老師：下次見！");
    break;
  }

  try {
    console.log(`英文單字小老師：${await chatManager.sendMessage(userQuestion)}\n`);
  } catch (error) {
    console.error("無法取得回覆，請確認 OPENAI_API_KEY、網路與模型設定。", error.message);
  }
}
