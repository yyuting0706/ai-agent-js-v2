import { input } from "@inquirer/prompts";
import { initMessage } from "./db/messages.js";
import { askAssistant } from "./chat-manager.js";

await initMessage(
  "你是一位數學助理，請用繁體中文回答。遇到需要計算的問題時，使用 calculate 工具取得正確結果。"
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    const content = await askAssistant(userQuestion);
    console.log(content);
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
