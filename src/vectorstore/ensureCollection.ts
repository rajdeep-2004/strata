import qdrantClient from "./qdrantClient";
import { COLLECTION_NAME, DISTANCE_METRIC, EMBEDDING_DIMENSION } from "./vectorStoreConfig";

export default async function ensureCollection() {
  const collectionExists = await qdrantClient.collectionExists("embeddedCode");
  if (!collectionExists.exists) {
    await qdrantClient.createCollection(COLLECTION_NAME, {
      vectors: { size: EMBEDDING_DIMENSION, distance: DISTANCE_METRIC },
    });
  }
}
