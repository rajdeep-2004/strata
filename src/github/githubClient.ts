import axios from "axios";

export async function getRepositoryTree(
  githubRepoOwner: string,
  repoName: string,
  defaultBranch: string,
) {
  const repoTreeObj = await axios.get(
    `https://api.github.com/repos/${githubRepoOwner}/${repoName}/git/trees/${defaultBranch}?recursive=1`,
  );
  return repoTreeObj.data.tree;
}

export async function getFileContent(
  githubRepoOwner: string,
  repoName: string,
  path: string,
) {
  const fileContentObj = await axios.get(
    `https://api.github.com/repos/${githubRepoOwner}/${repoName}/contents/${path}`,
  );
  return Buffer.from(fileContentObj.data.content, "base64").toString("utf-8");
}
