import { Repository } from "../models/Repository";
import { shouldIndexFile } from "./shouldIndexFile";
import { getFileContent, getRepositoryTree } from "../github/githubClient";
import { getChunks } from "./chunking";
import { getEmbeddedChunks } from "../embeddings/getEmbeddedChunks";

export async function ingestionPipeline(repository: Repository) {
  const { githubRepoOwner, repoName, defaultBranch, githubRepoId } = repository;
  const repoTree = await getRepositoryTree(
    githubRepoOwner,
    repoName,
    defaultBranch,
  );

  for (const node of repoTree) {
    if (node.type !== "blob") continue;
    const shouldIndex = shouldIndexFile(node.path);
    if (!shouldIndex) continue;
    const fileContent = await getFileContent(
      githubRepoOwner,
      repoName,
      node.path,
    );
    const chunks = await getChunks(fileContent, node.path, githubRepoId);
    const embeddedChunks =  await getEmbeddedChunks(chunks);
  }
}
