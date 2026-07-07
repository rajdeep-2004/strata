import { GoogleGenAI } from "@google/genai";
import { Document } from "@langchain/core/documents";
const ai = new GoogleGenAI({});
let requestCount = 0;

export async function embedBatchChunks(batchChunks: Document[]) {
  const chunkContents = batchChunks.map((chunk) => ({
    parts: [{ text: chunk.pageContent }],
  }));

  requestCount++;
  console.log("Embedding request:", requestCount);
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: chunkContents,
  });
  if (!response.embeddings) throw new Error("Error fetching the embeddings");

  const embeddedBatchChunks = response.embeddings.map((embed) => embed.values);

  return embeddedBatchChunks;
}
