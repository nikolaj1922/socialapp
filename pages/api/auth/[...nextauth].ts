import { ExtendedUserType } from "@/types/types";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";


export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      (session.user as ExtendedUserType).tag = session
        .user!.name!.split(" ")
        .join("")
        .toLocaleLowerCase();

      (session.user as ExtendedUserType).uid = token.sub;
      return session;
    },
  },
});
