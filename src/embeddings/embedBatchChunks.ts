import { Document } from "@langchain/core/documents";
import { Ollama } from "ollama";
import { OllamaService } from "./ollama";
const ollama = new Ollama();

export async function embedBatchChunks(batchChunks: Document[]) {
  const chunkContents = batchChunks.map((chunk) => chunk.pageContent);
  const embeddedBatchChunks = await OllamaService(chunkContents);

  return embeddedBatchChunks.embeddings;
}
