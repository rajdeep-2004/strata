import qdrantClient from "../vectorstore/qdrantClient";
import { COLLECTION_NAME } from "../vectorstore/vectorStoreConfig";

export async function searchRelevantChunks(
  queryVector: number[],
  githubRepoId: string,
) {
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
    limit: 5,
  });
  return response.points.map((chunk) => ({
    score: chunk.score,
    payload: chunk.payload,
  }));
}
