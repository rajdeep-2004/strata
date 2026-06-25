import dbConnect from "@/src/lib/dbConnect";
import RepositoryModel from "@/src/models/Repository";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import axios, { isAxiosError } from "axios";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { githubUrl } = await request.json();
    const regex = /github\.com[\/:]["']?([^\/]+)\/([^\s\/.]+)(?:\.git)?/;
    const match = githubUrl.match(regex);
    if (!session) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
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

    const repository = new RepositoryModel({
      userId: session.user._id,
      githubRepoId: githubRepo.id.toString(),
      githubRepoUrl: githubUrl,
      repoName: githubRepo.name,
      visibility: githubRepo.private ? "private" : "public",
      githubRepoOwner: githubRepo.owner.login,
      defaultBranch: githubRepo.default_branch,
    });

    await repository.save();

    return Response.json(
      {
        success: true,
        message: "Repository Added",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log("[REPOSITORY_ADD_ERROR]: ", error);
    if (isAxiosError(error)) {
      return Response.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.response?.status ?? 500 },
      );
    }
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
