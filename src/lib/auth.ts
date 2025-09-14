// src/lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    // add other providers here (GitHub, Email, Credentials, etc.)
  ],
  session: { strategy: "database" }, // adapter => database sessions are default
  secret: process.env.AUTH_SECRET, // ensure this is set in production
  // add callbacks, pages, security options, etc.
});
