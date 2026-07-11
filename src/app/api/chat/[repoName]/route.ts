import { retrievalPipeline } from "@/src/retrieval/retrievalPipeline";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query, githubRepoId } = await request.json();
    const answer = await retrievalPipeline(query, githubRepoId);
    return Response.json({
      success: true,
      answer: answer,
    });
  } catch (error) {
    console.log("[ANSWER_RETRIEVAL_ERROR]: ", error);
    return Response.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
