import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user?.email) {
        const email = user.email.toLowerCase();
        let dbUser = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });

        if (!dbUser) {
          try {
            dbUser = await prisma.user.create({
              data: {
                email,
                name: user.name,
                image: user.image,
                provider: "google",
                role: "customer",
              },
            });
          } catch (error) {
            const isUniqueViolation =
              error &&
              typeof error === "object" &&
              (error as { code?: string }).code === "P2002";
            if (!isUniqueViolation) throw error;
            // Concurrent first-time sign-in: another request created the
            // row between the lookup and the create. Re-fetch instead of
            // failing so both attempts resolve to the same user.
            dbUser = await prisma.user.findFirst({
              where: { email: { equals: email, mode: "insensitive" } },
            });
            if (!dbUser) throw error;
          }
        }

        if (!dbUser.provider || dbUser.provider === "credentials") {
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              provider: "google",
              image: user.image || dbUser.image,
            },
          });
        }

        user.id = dbUser.id;
        (user as unknown as Record<string, unknown>).role = dbUser.role;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as unknown as Record<string, unknown>).role as string;
        token.picture = user.image;
      }
      if (account?.provider) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).provider = token.provider;
        session.user.image = token.picture as string | null;
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};
