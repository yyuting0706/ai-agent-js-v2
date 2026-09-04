# AI Agent 實作工作坊 v5（JavaScript 版）

by eddie@5xcampus.com

這個 repo 以 Git 分支保存每一個教學進度。切到教材對應的
分支後，開啟 GitHub Codespaces 即可直接使用 Node.js 22。

## 作業 1：英文單字小老師

### 執行方式

1. 複製 `.env.example` 為 `.env`，填入 `OPENAI_API_KEY`。
2. 執行 `npm install` 安裝依賴。
3. 執行 `npm start` 開始對話；輸入 `exit` 或 `quit` 結束。

`ChatManager` 會保存每輪 user 與 assistant 訊息，將完整對話歷史傳給模型，因此小老師可以根據前文複習和比較單字。

### 6 輪對話紀錄

以下為符合角色設定的測試紀錄：

**第 1 輪**

使用者：請教我 `abandon` 的用法。

英文單字小老師：`abandon` 是動詞，意思是「放棄、遺棄」。例如：`She decided to abandon the plan.`（她決定放棄這個計畫。）它通常表示完全停止支持某件事，語氣比 `leave` 強。

**第 2 輪**

使用者：那它和 `give up` 有什麼不同？

英文單字小老師：兩者都能表示「放棄」，但 `give up` 較口語，也常指放棄努力；`abandon` 較正式，常用於計畫、想法或某人。剛才的 `abandon the plan` 很自然，口語也可以說 `give up on the plan`。

**第 3 輪**

使用者：請幫我複習剛才的 `abandon`，再給一個例句。

英文單字小老師：當然！`abandon` 是正式的動詞「放棄、遺棄」。例句：`The hikers had to abandon their trip because of the storm.`（登山客因暴風雨而不得不放棄行程。）

**第 4 輪**

使用者：`abandon` 可以當名詞嗎？

英文單字小老師：`abandon` 通常當動詞；名詞是 `abandonment`，意思是「放棄、遺棄」。另外，片語 `with abandon` 是「放縱地、盡情地」，例如 `They danced with abandon.`（他們盡情跳舞。）

**第 5 輪**

使用者：考考我：`abandon` 和 `give up` 哪個比較正式？

英文單字小老師：答案是 `abandon` 比較正式。`give up` 比較口語，常用在「放棄努力」；請記得我們第 2 輪比較過的例子：`abandon the plan` 和 `give up on the plan`。

**第 6 輪**

使用者：我想學一個和「堅持」有關的反義詞。

英文單字小老師：可以學 `persist`，它是動詞，意思是「堅持」。例如：`She persisted despite many difficulties.`（儘管有許多困難，她仍堅持下去。）它和我們剛才學的 `abandon` 意思相反：一個是堅持，一個是放棄。
