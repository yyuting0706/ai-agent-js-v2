import { client } from "../lib/openai.js";
import {
  qdrant,
  COFFEE_COLLECTION,
  EMBEDDING_DIM,
} from "../lib/qdrant.js";

const EMBEDDING_MODEL = "text-embedding-3-small";

const coffeeKnowledge = [
  {
    id: 1,
    name: "美式咖啡",
    content:
      "美式咖啡以濃縮咖啡加入熱水製成，風味清爽、口感較淡，帶有咖啡豆本身的香氣與微苦。適合喜歡長時間慢慢品飲、不需要奶泡或牛奶的人。冰美式則是加入冰塊與冷水，清涼俐落。",
  },
  {
    id: 2,
    name: "拿鐵咖啡",
    content:
      "拿鐵咖啡由濃縮咖啡與大量熱牛奶組成，表面覆有薄薄的奶泡。牛奶讓口感變得滑順柔和，咖啡苦味較低，常見風味有堅果、焦糖與奶香，適合剛開始喝咖啡的人。",
  },
  {
    id: 3,
    name: "卡布奇諾",
    content:
      "卡布奇諾通常由等比例的濃縮咖啡、熱牛奶與綿密奶泡組成。奶泡比拿鐵厚實，口感蓬鬆，咖啡風味也較突出，常會在表面撒上可可粉或肉桂粉。",
  },
  {
    id: 4,
    name: "摩卡咖啡",
    content:
      "摩卡咖啡是在濃縮咖啡與熱牛奶中加入巧克力或巧克力醬，再覆蓋奶泡，有時會加鮮奶油。它同時具有咖啡的香氣與巧克力的甜味，適合喜歡甜點風味飲品的人。",
  },
  {
    id: 5,
    name: "焦糖瑪奇朵",
    content:
      "焦糖瑪奇朵通常以香草糖漿、熱牛奶與奶泡為基底，再加入濃縮咖啡，最後淋上焦糖醬。風味香甜、奶泡柔細，焦糖與香草氣息明顯，適合偏好甜味與奶香的人。",
  },
];

async function embedTexts(texts) {
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return response.data.map((item) => item.embedding);
}

async function recreateCollection() {
  const exists = await qdrant.collectionExists(COFFEE_COLLECTION);
  if (exists.exists) {
    await qdrant.deleteCollection(COFFEE_COLLECTION);
  }
  await qdrant.createCollection(COFFEE_COLLECTION, {
    vectors: { size: EMBEDDING_DIM, distance: "Cosine" },
  });
}

async function main() {
  await recreateCollection();
  const texts = coffeeKnowledge.map(
    ({ name, content }) => `${name}：${content}`,
  );
  const vectors = await embedTexts(texts);

  await qdrant.upsert(COFFEE_COLLECTION, {
    wait: true,
    points: coffeeKnowledge.map((item, index) => ({
      id: item.id,
      vector: vectors[index],
      payload: item,
    })),
  });

  console.log(
    `已將 ${coffeeKnowledge.length} 筆咖啡知識加入 collection: ${COFFEE_COLLECTION}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});