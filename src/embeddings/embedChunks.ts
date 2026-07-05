import { GoogleGenAI } from "@google/genai";
import { Document } from "@langchain/core/documents";
const ai = new GoogleGenAI({});

export async function embedChunks(chunk: Document) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: chunk.pageContent,
  });
  return response.embeddings?.[0]?.values;
}
