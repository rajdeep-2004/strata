import { Document } from "@langchain/core/documents";
import { embedChunks } from "./embedChunks";
import crypto from "crypto";
import { EmbeddedChunk } from "./types";

export async function getEmbeddedChunks(chunks: Document[]) {
  const embeddedChunks: EmbeddedChunk[] = [];
  for (const chunk of chunks) {
    const embedChunk = await embedChunks(chunk);
    if (!embedChunk) throw new Error("Error during Embedding");
    const id = crypto
      .createHash("sha256")
      .update(
        `${chunk.metadata.githubRepoId}:${chunk.metadata.filePath}:${chunk.metadata.chunkIndex}`,
      )
      .digest("hex");

    embeddedChunks.push({
      id,
      embedding: embedChunk,
      pageContent: chunk.pageContent,
      metadata: { ...(chunk.metadata as EmbeddedChunk["metadata"]) },
    });
  }
  return embeddedChunks;
}
