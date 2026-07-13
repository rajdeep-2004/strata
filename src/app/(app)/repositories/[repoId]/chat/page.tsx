import dbConnect from "@/src/lib/dbConnect";
import RepositoryModel from "@/src/models/Repository";
import MessageModel from "@/src/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import ChatClient from "./ChatClient";

interface ChatPageProps {
  params: Promise<{
    repoId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { repoId } = await params;

  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Fetch repository details directly from MongoDB
  const repository = await RepositoryModel.findOne({
    _id: repoId,
    userId: session.user._id,
  });

  if (!repository) {
    redirect("/dashboard");
  }

  // Load message history directly from MongoDB
  const messages = await MessageModel.find({
    repositoryId: repoId,
    userId: session.user._id,
  }).sort({ createdAt: 1 });

  // Serialize Mongoose models into clean JSON objects for the client component
  const serializedRepository = {
    _id: repository._id.toString(),
    githubRepoId: repository.githubRepoId,
    githubRepoUrl: repository.githubRepoUrl,
    repoName: repository.repoName,
    visibility: repository.visibility,
    status: repository.status,
    indexingStage: repository.indexingStage || undefined,
    defaultBranch: repository.defaultBranch,
    languages: repository.languages,
  };

  const serializedMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return (
    <ChatClient
      repository={serializedRepository}
      initialMessages={serializedMessages}
      sessionUser={{
        avatarUrl: session.user.avatarUrl,
        name: session.user.name,
      }}
    />
  );
}
