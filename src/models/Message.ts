import mongoose, { Document, Schema, Types } from "mongoose";

export interface Message extends Document {
  userId: Types.ObjectId;
  repositoryId: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
}

const MessageSchema: Schema<Message> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

MessageSchema.index({
  repositoryId: 1,
  createdAt: 1,
});

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", MessageSchema);

export default MessageModel;