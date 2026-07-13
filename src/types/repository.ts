export interface Repository {
  _id: string;
  githubRepoId: string;
  githubRepoUrl: string;
  repoName: string;
  visibility: "public" | "private";
  status: "pending" | "indexing" | "ready" | "failed";
  indexingStage?: "connecting" | "chunking" | "embedding" | "storing";
  defaultBranch: string;
  languages: string[];
  lastIndexedAt?: string;
}