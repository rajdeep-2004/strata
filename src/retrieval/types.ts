export interface RelevantChunk {
  score: number;
  payload: {
    pageContent: string;
    filePath: string;
    language?: string;
    chunkIndex: number;
    githubRepoId: string;
    totalChunks: number;
    loc?: {
      lines: {
        from: number;
        to: number;
      };
    };
  };
}
