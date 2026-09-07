import { cosineSimilarity, embed } from "../lib/embeddings.js";

const testGroups = [
  {
    name: "第 1 組：意思相近",
    sentences: ["我喜歡貓", "貓咪很可愛", "我養了一隻貓"],
  },
  {
    name: "第 2 組：意思不同",
    sentences: ["今天天氣很好", "我要去買菜", "電腦壞了"],
  },
  {
    name: "第 3 組：自訂案例",
    sentences: ["我每天早上跑步", "運動讓身體更健康", "我喜歡看科幻電影"],
  },
];

async function compareGroup(group) {
  const vectors = await Promise.all(group.sentences.map(embed));

  console.log(`\n## ${group.name}`);
  for (let leftIndex = 0; leftIndex < group.sentences.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < group.sentences.length;
      rightIndex += 1
    ) {
      const score = cosineSimilarity(vectors[leftIndex], vectors[rightIndex]);
      console.log(
        `${group.sentences[leftIndex]} <-> ${group.sentences[rightIndex]}: ${score.toFixed(4)}`,
      );
    }
  }
}

async function main() {
  console.log("使用 text-embedding-3-small 計算兩兩句子相似度");
  for (const group of testGroups) {
    await compareGroup(group);
  }
}

main().catch((error) => {
  console.error("相似度測試失敗：", error.message);
  process.exitCode = 1;
});