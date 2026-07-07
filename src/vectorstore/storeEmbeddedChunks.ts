import { EmbeddedChunk } from "../embeddings/types";
import getPoints from "./getPoint";
import qdrantClient from "./qdrantClient";
import { COLLECTION_NAME } from "./vectorStoreConfig";

export async function storeEmbeddedChunks(embeddedChunks: EmbeddedChunk[]) {
  const points = getPoints(embeddedChunks);
  await qdrantClient.upsert(COLLECTION_NAME, { points });
}