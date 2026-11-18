import qdrantClient from "../vectorstore/qdrantClient";
import { COLLECTION_NAME } from "../vectorstore/vectorStoreConfig";
import { MIN_RELEVANCE_SCORE, RETRIEVAL_LIMIT } from "./retrievalConfig";
import { RelevantChunk } from "./types";

export async function searchRelevantChunks(
  queryVector: number[],
  githubRepoId: string,
): Promise<RelevantChunk[]> {
  const response = await qdrantClient.query(COLLECTION_NAME, {
    query: queryVector,
    filter: {
      must: [
        {
          key: "githubRepoId",
          match: {
            value: githubRepoId,
          },
        },
      ],
    },
    with_payload: true,
    limit: RETRIEVAL_LIMIT,
    score_threshold: MIN_RELEVANCE_SCORE,
  });

  return response.points.map((chunk) => ({
    score: chunk.score,
    payload: chunk.payload as RelevantChunk["payload"],
  }));
}
