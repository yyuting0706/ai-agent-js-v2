import { input } from "@inquirer/prompts";
import { Agent, run } from "@openai/agents";
import { spinner } from "./utils/spinner.js";
import { toAgentTool } from "./utils/agent-tool.js";
import {
  weatherTool,
  youbikeTool,
  currentTimeTool,
  netflixTool,
  pythonBookTool,
} from "./tools/index.js";

const MODEL = "gpt-5.4-mini";
const MODEL_SETTINGS = { reasoning: { effort: "low" } };

const phpTeacher = new Agent({
  name: "PHP 老師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions:
    "你是 PHP 老師，專門回答 PHP、Laravel 相關問題。請用繁體中文回答。",
  handoffDescription: "PHP 或 Laravel 相關問題",
});

const vueTeacher = new Agent({
  name: "Vue 老師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions:
    "你是 Vue 老師，專門回答 Vue.js、Nuxt 相關問題。請用繁體中文回答。",
  handoffDescription: "Vue.js 或 Nuxt 相關問題",
});

const pythonTeacher = new Agent({
  name: "Python 老師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions:
    "你是 Python 老師，請用繁體中文回答 Python 相關問題。如果問題是關於《為你自己學 Python》這本書、或 Python 的入門背景（用途、特色、怎麼學），先用 search_learn_python 查書裡的內容再回答；其他 Python 問題用你自己的知識解釋即可。",
  handoffDescription: "Python 語法、函式庫，或《為你自己學 Python》這本書的相關問題",
  tools: [toAgentTool(pythonBookTool)],
});

const timeTeacher = new Agent({
  name: "時間老師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions:
    "你是時間老師，只負責回答目前時間。凡是詢問現在幾點、幾點、目前時間或時間，都必須使用 get_current_time 取得最新時間，不要自行推測，也不要查天氣。請用繁體中文回答。",
  handoffDescription: "只處理現在幾點、目前時間等時間問題；不處理天氣",
  tools: [toAgentTool(currentTimeTool)],
});

const weatherTeacher = new Agent({
  name: "天氣老師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions:
    "你是天氣老師，只負責回答天氣。只有使用者詢問天氣、氣溫、下雨或晴陰等天氣狀況時，才使用 get_weather 查詢；不要回答現在幾點或其他時間問題。城市名稱請用英文傳給工具，例如台北使用 Taipei，並用繁體中文回答。",
  handoffDescription: "只處理指定城市的天氣、氣溫或降雨問題；不處理時間",
  tools: [toAgentTool(weatherTool)],
});

const homeroom = Agent.create({
  name: "班導師",
  model: MODEL,
  modelSettings: MODEL_SETTINGS,
  instructions: `你是班導師，協助學生回答各種問題。
- PHP / Laravel 問題請 handoff 給 PHP 老師
- Vue.js / Nuxt 問題請 handoff 給 Vue 老師
- Python 問題請 handoff 給 Python 老師
- 只要問題包含「現在幾點」「幾點」「目前時間」或詢問時間，且沒有天氣問題，必須 handoff 給時間老師，絕對不要 handoff 給天氣老師
- 只要問題是在詢問天氣、氣溫、下雨或晴陰，且沒有時間問題，必須 handoff 給天氣老師
- 如果同一個問題同時詢問時間和天氣，請在回答前分別呼叫兩個工具，再整合結果
- 例：「現在幾點？」只能交給時間老師；例：「台北天氣如何？」只能交給天氣老師
- 其他一般生活問題（YouBike、Netflix 影片）可以直接用對應的 tools 回答
請用繁體中文回答。`,
  tools: [
    toAgentTool(currentTimeTool),
    toAgentTool(weatherTool),
    toAgentTool(youbikeTool),
    toAgentTool(netflixTool),
  ],
  handoffs: [phpTeacher, vueTeacher, pythonTeacher, timeTeacher, weatherTeacher],
});

function selectAgent(userInput) {
  const asksTime = /現在.*幾點|幾點|目前.*時間|現在時間/.test(userInput);
  const asksWeather = /天氣|氣溫|溫度|下雨|晴|陰|降雨/.test(userInput);

  if (asksTime && !asksWeather) return timeTeacher;
  if (asksWeather && !asksTime) return weatherTeacher;
  return homeroom;
}

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
        selectAgent(userInput),
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
}
