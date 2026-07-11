import { ingestionPipeline } from "@/src/ingestion/ingestionPipeline";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { repository, token } = await request.json();

    ingestionPipeline(repository, token).catch((error) => {
      console.log("[REPOSITORY_ADD_ERROR] :", error);
    });
    return Response.json(
      {
        success: true,
        message: "Repository Added",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Erro",
      },
      { status: 500 },
    );
  }
}
