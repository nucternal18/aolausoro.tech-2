import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, {
  Account,
  Awaitable,
  DefaultSession,
  NextAuthOptions,
  Session,
  User,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import matchPassword from "lib/matchPasswords";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";

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

interface ISessionProps {
  user: UserProps;
  expires: Date;
}

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
  debug: true,
  providers: [
    CredentialsProvider({
      async authorize(credentials: CredentialsProps) {
        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
        });
        await prisma.$disconnect();

        if (
          user &&
          (await matchPassword(credentials.password, user.password))
        ) {
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
      credentials: {
        email: { label: "Username", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
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
      // Note, that `rest.session` can be any arbitrary object, remember to validate it!
      if (trigger === "update" && newSession?.user) {
        // You can update the session in the database if it's not already updated.
        // await adapter.updateUser(session.user.id, { name: newSession.name })

        // Make sure the updated value is reflected on the client
        session.user = newSession.user;
      }
      // Add property to session, like an access_token from a provider.
      session.user = token.user as UserProps;
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
      user: User | AdapterUser;
      account: Account | null;
    }) {
      // Add access_token to the token right after signin
      user && (token.user = user);
      return token;
    },
  },
};

export default NextAuth(authOptions);
