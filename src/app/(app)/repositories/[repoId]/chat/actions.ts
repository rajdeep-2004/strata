"use server";

import dbConnect from "@/src/lib/dbConnect";
import MessageModel from "@/src/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/options";

export async function saveMessageAction(
  repoId: string,
  role: "user" | "assistant",
  content: string
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Unauthorized Access");
    }

    const message = new MessageModel({
      userId: session.user._id,
      repositoryId: repoId,
      role,
      content,
    });

    await message.save();
    return { success: true };
  } catch (error) {
    console.error("[SERVER_ACTION_SAVE_MESSAGE_ERROR]:", error);
    throw new Error("Failed to save message");
  }
}
