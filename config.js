import "dotenv/config";

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const configuredQdrantUrl = process.env.QDRANT_URL;
export const QDRANT_URL =
	configuredQdrantUrl && !configuredQdrantUrl.includes("<cluster-id>")
		? configuredQdrantUrl
		: "http://localhost:6333";
export const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
