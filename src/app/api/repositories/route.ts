import dbConnect from "@/src/lib/dbConnect";
import RepositoryModel from "@/src/models/Repository";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import axios, { isAxiosError } from "axios";
import { ingestionPipeline } from "@/src/ingestion/ingestionPipeline";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { githubUrl } = await request.json();
    const regex = /github\.com[\/:]["']?([^\/]+)\/([^\s\/.]+)(?:\.git)?/;
    const match = githubUrl.match(regex);
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
    if (!match) {
      return Response.json(
        {
          success: false,
          message: "Invalid Repository URL",
        },
        { status: 400 },
      );
    }
    const githubRepoOwner = match[1];
    const repoName = match[2];

    const response = await axios.get(
      `https://api.github.com/repos/${githubRepoOwner}/${repoName}`,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
        },
      },
    );

    const githubRepo = response.data;

    const existingRepo = await RepositoryModel.findOne({
      userId: session?.user._id,
      githubRepoId: githubRepo.id.toString(),
    });

    if (existingRepo) {
      return Response.json(
        {
          success: false,
          message: "Repository is already added",
        },
        { status: 400 },
      );
    }

    const languageObj = await axios.get(
      `https://api.github.com/repos/${githubRepoOwner}/${repoName}/languages
`,
      {
        headers: {
          Authorization: `Bearer ${token?.access_token}`,
        },
      },
    );
    const languages = Object.keys(languageObj.data);
    const repository = new RepositoryModel({
      userId: session.user._id,
      githubRepoId: githubRepo.id.toString(),
      githubRepoUrl: githubUrl,
      repoName: githubRepo.name,
      visibility: githubRepo.private ? "private" : "public",
      githubRepoOwner: githubRepo.owner.login,
      defaultBranch: githubRepo.default_branch,
      status: "pending",
      languages,
    });

    await repository.save();

    ingestionPipeline(repository, token).catch(async (error) => {
      console.log("[REPOSITORY_ADD_ERROR] :", error);
      repository.status = "failed";
      repository.indexingStage = undefined;
      await repository.save();
    });

    return Response.json(
      {
        success: true,
        message: "Repository Added",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("[REPOSITORY_ADD_ERROR]: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect()
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
      "languages"
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
    return Response.json({
      success: false,
      message: "Internal Server Error"
    }, { status: 500 })
  }
}
