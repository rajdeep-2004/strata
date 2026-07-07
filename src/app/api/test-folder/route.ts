import { embedQuery } from "@/src/retrieval/embedQuery";
import { retrievalPipeline } from "@/src/retrieval/retrievalPipeline";
import { searchRelevantChunks } from "@/src/retrieval/searchRelevantChunks";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { query, githubRepoId } = await request.json();
  const answer = await retrievalPipeline(query, githubRepoId);
  return Response.json({
    answer: answer,
  });
}
