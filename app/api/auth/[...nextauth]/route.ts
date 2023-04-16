import NextAuth, { Account, NextAuthOptions, Session, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type CredentialsProps = {
  email: string;
  password: string;
};

type UserProps = {
  id: string;
  image: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SIGNING_PRIVATE_KEY,
    maxAge: 60 * 60 * 24 * 30,
  },
  providers: [
    CredentialsProvider({
      name: "aolausoro.tech",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: CredentialsProps) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user.id,
            image: user.image,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @param  {object}  user      User object      (only available on sign in)
     * @return {object}              Session that will be returned to the client
     */
    async session({
      session,
      token,
      trigger,
      newSession,
      user,
    }: {
      session: Session;
      token: JWT;
      user: AdapterUser;
      trigger: "update";
      newSession: any;
    }): Promise<Session> {
      // Add property to session, like an access_token from a provider.
      session.user = token.user;
      return session;
    },
    /**
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user:
        | (User & { isAdmin: boolean })
        | (AdapterUser & { isAdmin: boolean });
      account: Account | null;
    }) {
      // Add access_token to the token right after signin
      user && (token.user = user);
      token.userRole = "admin";
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
