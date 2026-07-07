import axios from "axios";
import { getToken, JWT } from "next-auth/jwt";

export async function getRepositoryTree(
  githubRepoOwner: string,
  repoName: string,
  defaultBranch: string,
  token: JWT,
) {
  const repoTreeObj = await axios.get(
    `https://api.github.com/repos/${githubRepoOwner}/${repoName}/git/trees/${defaultBranch}?recursive=1`,
    {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
      },
    },
  );
  return repoTreeObj.data.tree;
}

export async function getFileContent(
  githubRepoOwner: string,
  repoName: string,
  path: string,
  token: JWT,
) {
  const fileContentObj = await axios.get(
    `https://api.github.com/repos/${githubRepoOwner}/${repoName}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
      },
    },
  );
  return Buffer.from(fileContentObj.data.content, "base64").toString("utf-8");
}
