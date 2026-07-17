import { Document } from "@langchain/core/documents";
import { embedBatchChunks } from "./embedBatchChunks";
import { EmbeddedChunk } from "./types";
import { UUIDTypes, v5 as uuidv5 } from "uuid";
import { BATCH_SIZE } from "./embeddingConfig";
import pMap from "p-map";

export async function getEmbeddedChunks(chunks: Document[]) {
  const embeddedChunks: EmbeddedChunk[] = [];

  let batchArray = [];
  for (let i = 0; i < chunks.length + 1; i = i + BATCH_SIZE) {
    batchArray.push(chunks.slice(i, i + BATCH_SIZE));
  }
  const embeddedBatch = await pMap(batchArray, embedBatchChunks, {
    concurrency: 4,
  });

  for (let i = 0; i < batchArray.length; i = i + 1) {
    const batch = batchArray[i];
    for (let j = 0; j < batch.length; j = j + 1) {
      const id = uuidv5(
        `${batch[j].metadata.githubRepoId}:${batch[j].metadata.filePath}:${batch[j].metadata.chunkIndex}`,
        process.env.NAMESPACE as UUIDTypes,
      );

      embeddedChunks.push({
        id,
        vector: embeddedBatch[i][j],
        pageContent: batch[j].pageContent,
        metadata: { ...(batch[j].metadata as EmbeddedChunk["metadata"]) },
      });
    }
  }
  return embeddedChunks;
}
