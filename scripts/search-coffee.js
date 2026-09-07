import { client } from "../lib/openai.js";
import { qdrant, COFFEE_COLLECTION } from "../lib/qdrant.js";

const EMBEDDING_MODEL = "text-embedding-3-small";
const queries = [
  "美式咖啡適合喜歡清爽、不加牛奶的咖啡嗎？",
  "哪一種咖啡的奶泡最厚實蓬鬆，並且由濃縮咖啡、熱牛奶和奶泡組成？",
  "我喜歡巧克力和甜甜的飲料，適合點什麼咖啡？",
];

async function embedQuery(query) {
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: query,
  });
  return response.data[0].embedding;
}

async function search(query) {
  const vector = await embedQuery(query);
  return qdrant.search(COFFEE_COLLECTION, {
    vector,
    limit: 3,
    with_payload: true,
  });
}

async function main() {
  for (const [index, query] of queries.entries()) {
    const results = await search(query);
    console.log(`\n查詢 ${index + 1}：${query}`);
    for (const result of results) {
      console.log(
        `- ${result.payload.name} | score: ${result.score.toFixed(4)} | ${result.payload.content}`,
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});