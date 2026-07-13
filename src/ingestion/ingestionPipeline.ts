import { DBRepository } from "../models/Repository";
import { shouldIndexFile } from "./shouldIndexFile";
import { getFileContent, getRepositoryTree } from "../github/githubClient";
import { getChunks } from "./chunking";
import { getEmbeddedChunks } from "../embeddings/getEmbeddedChunks";
import ensureCollection from "../vectorstore/ensureCollection";
import { storeEmbeddedChunks } from "../vectorstore/storeEmbeddedChunks";
import { JWT } from "next-auth/jwt";

export async function ingestionPipeline(repository: DBRepository, token: JWT) {
  repository.status = "indexing";
  repository.indexingStage = "connecting";
  await repository.save();
  const { githubRepoOwner, repoName, defaultBranch, githubRepoId } = repository;
  const repoTree = await getRepositoryTree(
    githubRepoOwner,
    repoName,
    defaultBranch,
    token,
  );
  repository.indexingStage = "chunking";
  await repository.save();

  await ensureCollection();

  const allChunks = [];
  for (const node of repoTree) {
    if (node.type !== "blob") continue;
    const shouldIndex = shouldIndexFile(node.path);
    if (!shouldIndex) continue;
    const fileContent = await getFileContent(
      githubRepoOwner,
      repoName,
      node.path,
      token,
    );
    const chunks = await getChunks(fileContent, node.path, githubRepoId);
    allChunks.push(...chunks);
  }

  repository.indexingStage = "embedding";
  await repository.save();
  const embeddedChunks = await getEmbeddedChunks(allChunks.slice(0, 80)); // TODO: api limit
  repository.indexingStage = "storing";
  await repository.save();
  await storeEmbeddedChunks(embeddedChunks);
  repository.status = "ready";
  repository.indexingStage = undefined;
  await repository.save();
}
