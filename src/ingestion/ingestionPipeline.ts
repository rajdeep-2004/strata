import { Repository } from "../models/Repository";
import { shouldIndexFile } from "./shouldIndexFile";
import { getFileContent, getRepositoryTree } from "../github/githubClient";
import { getChunks } from "./chunking";

export async function ingestionPipeline(repository: Repository) {
  const { githubRepoOwner, repoName, defaultBranch } = repository;
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
    console.log(`[FILE]: ${node.path} : ${fileContent}`);
    const chunks = await getChunks(fileContent, node.path);
  }
}
