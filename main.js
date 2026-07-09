import { input } from "@inquirer/prompts";
import { run } from "@openai/agents";
import { spinner } from "./utils/spinner.js";
import { buildClassroomAgent } from "./agents/classroom.js";

const classroom = await buildClassroomAgent();

let thread = [];

try {
  while (true) {
    const userInput = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userInput === "") continue;
    if (userInput.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    const spin = spinner("處理中...").start();
    let result;

    try {
      result = await run(
        classroom.agent,
        thread.concat({ role: "user", content: userInput }),
        { maxTurns: 8 },
      );
    } finally {
      spin.stop();
    }

    thread = result.history;

    console.log(`\n[由 ${result.lastAgent?.name ?? "班導師"} 回答]`);
    console.log(result.finalOutput);
    console.log();
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
} finally {
  await classroom.close();
}
