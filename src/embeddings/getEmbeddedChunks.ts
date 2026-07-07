import { Document } from "@langchain/core/documents";
import { embedBatchChunks } from "./embedBatchChunks";
import { EmbeddedChunk } from "./types";
import { UUIDTypes, v5 as uuidv5 } from "uuid";
import { BATCH_SIZE } from "./embeddingConfig";

export async function getEmbeddedChunks(chunks: Document[]) {
  const embeddedChunks: EmbeddedChunk[] = [];

  for (let i = 0; i < chunks.length; i = i + BATCH_SIZE) {
    const chunkBatch = chunks.slice(i, i + BATCH_SIZE);
    const embeddedBatch = await embedBatchChunks(chunkBatch);
    if (embeddedBatch.length !== chunkBatch.length) {
      throw new Error("Embedding count mismatch.");
    }
    for (let j = 0; j < embeddedBatch.length; j++) {
      const chunk = chunkBatch[j];
      const id = uuidv5(
        `${chunk.metadata.githubRepoId}:${chunk.metadata.filePath}:${chunk.metadata.chunkIndex}`,
        process.env.NAMESPACE as UUIDTypes,
      );

      embeddedChunks.push({
        id,
        vector: embeddedBatch[j]!,
        pageContent: chunk.pageContent,
        metadata: { ...(chunk.metadata as EmbeddedChunk["metadata"]) },
      });
    }
    console.log("ONE BATCH EMBEDDED");
  }
  return embeddedChunks;
}
