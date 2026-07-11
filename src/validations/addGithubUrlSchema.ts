import * as z from "zod";

export const addGithubUrlSchema = z.object({
  githubUrl: z
    .string()
    .trim()
    .regex(
      /github\.com[\/:]["']?([^\/]+)\/([^\s\/.]+)(?:\.git)?/,
      "Enter correct github Url",
    ),
});
