import { buildContext } from "./buildContext";
import { buildPrompt } from "./buildPrompt";
import { embedQuery } from "./embedQuery";
import { generateAnswer } from "./generateAnswer";
import { NO_CONTEXT_ANSWER } from "./retrievalConfig";
import { searchRelevantChunks } from "./searchRelevantChunks";

export async function retrievalPipeline(query: string, githubRepoId: string) {
  const embeddedQuery = await embedQuery(query);
  if (!embeddedQuery) throw new Error("Query embedding is empty");

  const relevantChunks = await searchRelevantChunks(
    embeddedQuery,
    githubRepoId,
  );
  // Skip the LLM call when nothing relevant came back: it can only guess.
  if (relevantChunks.length === 0) return NO_CONTEXT_ANSWER;

  const context = buildContext(relevantChunks);
  const prompt = buildPrompt(context, query);
  return generateAnswer(prompt);
}
