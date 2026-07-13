import dbConnect from "@/src/lib/dbConnect";
import RepositoryModel from "@/src/models/Repository";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ingestionPipeline } from "@/src/ingestion/ingestionPipeline";
import { authOptions } from "../../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) throw new Error("Token not found");
    if (!session) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized Access",
        },
        { status: 401 },
      );
    }

    const { repositoryId } = await request.json();
    if (!repositoryId) {
      return Response.json(
        {
          success: false,
          message: "Repository ID is required",
        },
        { status: 400 },
      );
    }

    const repository = await RepositoryModel.findOne({
      _id: repositoryId,
      userId: session.user._id,
    });

    if (!repository) {
      return Response.json(
        {
          success: false,
          message: "Repository not found",
        },
        { status: 404 },
      );
    }

    repository.status = "pending";
    repository.indexingStage = undefined;
    await repository.save();

    // Trigger ingestion asynchronously
    ingestionPipeline(repository, token).catch((error) => {
      console.error("[ASYNC_RETRY_INGESTION_ERROR]:", error);
      repository.status = "failed";
      repository.indexingStage = undefined;
      repository.save();
    });

    return Response.json(
      {
        success: true,
        message: "Retry indexing initiated",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("[RETRY_INDEXING_ERROR]: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
