import { EmbeddedChunk } from "./../embeddings/types";

export default function getPoints(embeddedChunks: EmbeddedChunk[]) {
  const points = [];
  for (const embedChunk of embeddedChunks) {
    points.push({
      id: embedChunk.id,
      vector: embedChunk.vector,
      payload: { pageContent: embedChunk.pageContent, ...embedChunk.metadata },
    });
  }
  return points;
}
