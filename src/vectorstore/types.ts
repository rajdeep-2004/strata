import { EmbeddedChunk } from "../embeddings/types";

export default interface Point {
  id: string;
  vector: number[];
  payload: EmbeddedChunk["metadata"] & {
    pageContent: string;
  };
}
