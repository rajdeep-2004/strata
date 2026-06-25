import mongoose, { Schema, Document } from "mongoose";

export interface Repository extends Document {
  userId: Schema.Types.ObjectId;
  githubRepoId: string;
  githubRepoUrl: string;
  repoName: string;
  visibility: "public" | "private";
  status: "pending" | "indexing" | "ready" | "failed";
  githubRepoOwner: string;
  defaultBranch: string;
  lastIndexedAt?: Date;
}

const RepositorySchema: Schema<Repository> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    githubRepoId: {
      type: String,
      required: true,
    },
    githubRepoUrl: {
      type: String,
      required: true,
    },
    repoName: {
      type: String,
      required: true,
    },
    githubRepoOwner: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "indexing", "ready", "failed"],
      required: true,
      default: "pending"
    },
    defaultBranch: {
      type: String,
      required: true,
    },
    lastIndexedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

RepositorySchema.index({ userId: 1, githubRepoId: 1 }, { unique: true });

const RepositoryModel =
  (mongoose.models.Repository as mongoose.Model<Repository>) ||
  mongoose.model<Repository>("Repository", RepositorySchema);

export default RepositoryModel;
