import { GoogleGenAI } from "@google/genai";
import { Document } from "@langchain/core/documents";
const ai = new GoogleGenAI({});

export async function embedBatchChunks(batchChunks: Document[]) {
  const chunkContents = batchChunks.map((chunk) => ({
    parts: [{ text: chunk.pageContent }],
  }));

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: chunkContents,
  });
  if (!response.embeddings) throw new Error("Error fetching the embeddings");

  const embeddedBatchChunks = response.embeddings.map((embed) => embed.values);

  return embeddedBatchChunks;
}
