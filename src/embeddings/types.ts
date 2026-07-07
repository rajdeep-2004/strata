export interface EmbeddedChunk {
  id: string;
  vector: number[];
  pageContent: string;
  metadata: {
    filePath: string;
    language?: string;
    chunkIndex: number;
    githubRepoId: string;
    totalChunks: number;
  };
}
