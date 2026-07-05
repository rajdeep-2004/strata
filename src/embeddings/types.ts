export interface EmbeddedChunk {
  id: string;
  embedding: number[];
  pageContent: string;
  metadata: {
    filePath: string;
    language?: string;
    chunkIndex: number;
    githubRepoId: string;
    totalChunks: number;
  };
}
