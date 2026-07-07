import mongoose, { Schema, Document, mongo } from "mongoose";

export interface User extends Document {
  githubId: string;
  email?: string;
  githubUsername: string;
  name: string;
  avatarUrl: string;
  access_token: string;
}
const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  githubUsername: {
    type: String,
    required: [true, "Username is required"],
  },
  githubId: {
    type: String,
    required: [true, "Github Id is required"],
    unique: true,
  },
  avatarUrl: String,
  access_token: {
    type: String,
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
