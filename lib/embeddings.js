import { client } from "./openai.js";

export const EMBEDDING_MODEL = "text-embedding-3-small";

export async function embed(text) {
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return response.data[0].embedding;
}

export function cosineSimilarity(left, right) {
  if (left.length !== right.length) {
    throw new Error("向量維度必須相同");
  }

  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    dotProduct += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }

  const magnitude = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}