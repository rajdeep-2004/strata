import RepositoryModel from "@/src/models/Repository";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        {
          success: false,
          message: "UnAuthorized Access",
        },
        { status: 401 },
      );
    }
    const connectedRepositories = await RepositoryModel.find({
      userId: session.user._id,
    }).select([
      "githubRepoUrl",
      "repoName",
      "visibility",
      "status",
      "indexingStage",
      "defaultBranch",
      "lastIndexedAt",
    ]);
    return Response.json(
      {
        success: true,
        data: connectedRepositories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("[GET_REPOSITORIES_ERROR]: ", error);
  }
}
