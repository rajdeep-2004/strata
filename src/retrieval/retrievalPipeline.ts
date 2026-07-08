import { buildContext } from "./buildContext";
import { buildPrompt } from "./buildPrompt";
import { embedQuery } from "./embedQuery";
import { generateAnswer } from "./generateAnswer";
import { searchRelevantChunks } from "./searchRelevantChunks";
import { RelevantChunk } from "./types";

export async function retrievalPipeline(query: string, githubRepoId: string) {
  const embeddedQuery = await embedQuery(query);
  const relevantChunks = await searchRelevantChunks(
    embeddedQuery!,
    githubRepoId,
  );
  const context = buildContext(relevantChunks as RelevantChunk[]);
  const prompt = buildPrompt(context, query);
  const answer = await generateAnswer(prompt);
  return answer;
}
