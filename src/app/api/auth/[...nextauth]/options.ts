import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        await dbConnect();
        const exisitingUser = await UserModel.findOne({
          githubId: profile?.id.toString(),
        });
        if (!exisitingUser) {
          const newUser = new UserModel({
            name: profile?.name,
            email: profile?.email,
            githubId: profile?.id.toString(),
            githubUsername: profile?.login,
            avatarUrl: profile?.avatar_url
          });

          await newUser.save();
        }

        return true;
      } catch (error) {
        console.log("Error: ", error);
        return false;
      }
    },
    async jwt({ token, profile }) {
      if (profile) {
        try {
          await dbConnect();
          const existingUser = await UserModel.findOne({
            githubId: profile.id.toString(),
          });
          if (existingUser) {
            token._id = existingUser._id.toString();
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.githubId = existingUser.githubId;
            token.githubUsername = existingUser.githubUsername;
            token.avatarUrl = existingUser.avatarUrl;
          }
        } catch (error) {
          console.log("Error: ", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.githubId = token.githubId;
        session.user.githubUsername = token.githubUsername;
        session.user.avatarUrl = token.avatarUrl;
      }
      return session;
    },
  },
};
