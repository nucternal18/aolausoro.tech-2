import NextAuth, { type Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "./auth.config";
import prisma from "@lib/prismadb";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  callbacks: {
    session: async (params) => {
      const session = params.session;
      const token = params?.token;
      if (token?.sub && session?.user) {
        session.user.id = token.sub;
      }
      if (token?.isAdmin && session?.user) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      const loggedInUser = await prisma.user.findUnique({
        where: { id: token?.sub },
      });
      if (!loggedInUser) return token;
      token.isAdmin = loggedInUser.isAdmin;
      return token;
    },
    async signIn({ user }) {
      if (user.isAdmin) {
        return true;
      } else {
        return false;
      }
    },
  },
  ...authConfig,
});
