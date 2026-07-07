import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

export async function embedQuery(query: string) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: query,
  });
  if (!response.embeddings) throw new Error("Cannot embed the query");
  return response.embeddings[0].values;
}
