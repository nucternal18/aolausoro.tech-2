import NextAuth from "next-auth";
import type {
  Account,
  DefaultSession,
  NextAuthOptions,
  Profile,
  Session,
  User,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as z from "zod";
import CredentialsProvider from "next-auth/providers/credentials";
import { type JWT } from "next-auth/jwt";
import { type AdapterUser } from "next-auth/adapters";
import bcrypt from "bcryptjs";
import prisma from "@lib/prismadb";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z
    .string()
    .min(7)
    .max(50)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,})/, {
      message:
        "Password must contain at least 7 characters, one uppercase, one lowercase, one special character and one number.",
    }),
});

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
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
      ) {
        const validate = loginSchema.safeParse(credentials);

        if (!validate.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials?.email as string },
        });

        if (
          user &&
          bcrypt.compareSync(credentials?.password as string, user.password)
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
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: AdapterUser;
    } & { newSession: any; trigger: "update" }): Promise<
      Session | DefaultSession
    > {
      // Add property to session, like an access_token from a provider.
      session.user = {
        id: user.id,
        isAdmin: user.isAdmin,
        name: user.name,
        email: user.email,
        image: user.image,
      };
      return session;
    },
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: JWT;
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile | undefined;
      trigger?: "signIn" | "update" | "signUp" | undefined;
      isNewUser?: boolean | undefined;
      session?: any;
    }) {
      // Add access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.user = user;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
