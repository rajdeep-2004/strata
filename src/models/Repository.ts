import mongoose, { Schema, Document, Types } from "mongoose";

export interface DBRepository extends Document {
  userId: Types.ObjectId;
  githubRepoId: string;
  githubRepoUrl: string;
  repoName: string;
  visibility: "public" | "private";
  status: "pending" | "indexing" | "ready" | "failed";
  githubRepoOwner: string;
  defaultBranch: string;
  lastIndexedAt?: Date;
  indexingStage?: "connecting" | "chunking" | "embedding" | "storing";
  languages: string[];
}

const RepositorySchema: Schema<DBRepository> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
      default: "pending",
    },
    indexingStage: {
      type: String,
      enum: ["connecting", "chunking", "embedding", "storing"],
    },
    defaultBranch: {
      type: String,
      required: true,
    },
    lastIndexedAt: {
      type: Date,
    },
    languages: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

RepositorySchema.index({ userId: 1, githubRepoId: 1 }, { unique: true });

const RepositoryModel =
  (mongoose.models.Repository as mongoose.Model<DBRepository>) ||
  mongoose.model<DBRepository>("Repository", RepositorySchema);

export default RepositoryModel;
