# AI Agent 實作工作坊 v5（JavaScript 版）

by eddie@5xcampus.com

這個 repo 以 Git 分支保存每一個教學進度。切到教材對應的
分支後，開啟 GitHub Codespaces 即可直接使用 Node.js 22。

## 咖啡飲品向量知識庫

本分支使用 OpenAI `text-embedding-3-small` 將 5 種咖啡飲品說明轉成
1536 維向量，並儲存在 Qdrant 的 `coffee_drinks` collection，距離計算使用
Cosine similarity。

### 程式檔案

- `lib/openai.js`：OpenAI client 與 Embeddings API 設定。
- `lib/qdrant.js`：Qdrant client、collection 名稱與向量維度設定。
- `scripts/init-coffee.js`：建立 collection、產生 5 筆 embedding 並寫入 Qdrant。
- `scripts/search-coffee.js`：執行 3 組查詢，列出前 3 筆結果與相似度分數。

### 執行方式

先在 `.env` 設定 `OPENAI_API_KEY`、`QDRANT_URL` 與 `QDRANT_API_KEY`，再執行：

```bash
npm run coffee:init
npm run coffee:search
```

`coffee:init` 會重建 `coffee_drinks` collection，因此可重複執行以重置這個小型知識庫。

### 實際搜尋結果

以下為執行 `npm run coffee:search` 的結果摘要（每組列出前 3 筆，分數越高代表越相關）：

#### 查詢 1：美式咖啡適合喜歡清爽、不加牛奶的咖啡嗎？

1. 美式咖啡：`0.6757`
2. 拿鐵咖啡：`0.6370`
3. 摩卡咖啡：`0.5981`

最相關結果為美式咖啡，內容符合「濃縮咖啡加熱水、不加牛奶、風味清爽」的描述。

#### 查詢 2：哪一種咖啡的奶泡最厚實蓬鬆，並且由濃縮咖啡、熱牛奶和奶泡組成？

1. 卡布奇諾：`0.6530`
2. 拿鐵咖啡：`0.6001`
3. 摩卡咖啡：`0.5881`

最相關結果為卡布奇諾，內容提到等比例組成以及比拿鐵厚實、蓬鬆的奶泡。

#### 查詢 3：我喜歡巧克力和甜甜的飲料，適合點什麼咖啡？

1. 摩卡咖啡：`0.6922`
2. 拿鐵咖啡：`0.5731`
3. 美式咖啡：`0.5513`

最相關結果為摩卡咖啡，內容符合巧克力與甜點風味的需求。
