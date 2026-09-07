# AI Agent 實作工作坊 v5（JavaScript 版）

by eddie@5xcampus.com

JavaScript / Node.js 版的 AI Agent 教學課程，用 OpenAI Node SDK v6
（Responses API）、`@openai/agents`、Qdrant 與 MCP 實作。

## 章節進度（分支）

| 分支 | 主題 |
|------|------|
| `0.1-hello-world` | 起步 |
| `1.1-setup-env` | dotenv 環境變數 |
| `1.2-openai-api` | 第一次 Responses API 呼叫 |
| `1.3-openai-api-loop` | 對話迴圈 |
| `1.4-openai-api-with-memory` | lowdb 對話記憶 |
| `2.1-tool-calling-1` | tool calling 概念 |
| `2.2-tool-calling-2` | 真實 OpenWeather tool |
| `2.3-tool-calling-3` | 多 tool + 有上限的多輪 loop |
| `2.4-tool-calling-youbike` | YouBike API + Haversine |
| `2.5-tool-calling-current-time` | Zod schema 與執行期驗證 |
| `3.1-rag-text-to-vector` | Qdrant + Netflix embedding |
| `3.2-rag-search-text` | 語意搜尋 |
| `3.3-rag-tool` | RAG 包成 tool |
| `3.4-rag-for-pdf` | PDF RAG + recursive splitting |
| `4.1-agents-sdk` | Agents SDK 多 agent + handoff |

## 開發環境

GitHub Codespaces 會依 `.devcontainer/devcontainer.json` 建立 Node.js 22
環境。也可以在本機使用 Node.js 22+。

```bash
npm install
cp .env.example .env
npm start
```

章節 3 起另需 Qdrant；天氣工具另需 OpenWeather API key。金鑰只放在
`.env` 或 Codespaces secrets，不要提交到 Git。

## 天氣與時間工具驗收

目前主程式的「班導師」已註冊 `get_current_time` 與 `get_weather`，並要求
Agents SDK 依問題呼叫工具。啟動程式後輸入以下問題，可確認工具選擇與結果整合：

| 測試問題 | 預期工具呼叫 | 執行結果 |
|---|---|---|
| 現在幾點？ | `get_current_time` | 回傳台灣目前時間 |
| 台北天氣如何？ | `get_weather({ city: "Taipei" })` | 回傳台北溫度、濕度與天氣狀況 |
| 現在幾點？台北天氣好嗎？ | `get_current_time`、`get_weather({ city: "Taipei" })` | 同時取得兩項資料並以繁體中文整合回答 |

執行前請先在 `.env` 設定 `OPENWEATHER_API_KEY`，再執行：

```bash
npm start
```
