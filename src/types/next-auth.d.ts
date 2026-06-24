import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    name: string;
    email: string;
    githubId: number;
  }
  interface Session {
    user: {
      _id: string;
      name?: string;
      email?: string;
      githubId?: string;
      githubUsername: string;
      avatarUrl: string;
    } & DefaultSession["user"];
  }
  interface Profile {
    id: string;
    login: string;
    email: string;
    name: string;
    avatar_url: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    name?: string;
    email?: string;
    githubId: string;
    githubUsername: string;
    avatarUrl: string;
  }
}
