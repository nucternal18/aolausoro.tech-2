import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/userModel";

import db from "../../../lib/db";

type CredentialsProps = {
  email: string;
  password: string;
};

type UserProps = {
  _id: string;
  image: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

interface ISessionProps {
  user: UserProps;
  expires: Date;
}

export default NextAuth({
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
      async authorize(credentials: CredentialsProps, req: NextApiRequest) {
        await db.connectDB();

        const user = await User.findOne({ email: credentials.email });

        await db.disconnect();

        if (user && (await user.matchPassword(credentials.password))) {
          return {
            _id: user._id,
            image: user.image,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          };
        } else {
          return null;
        }
      },
      credentials: undefined,
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
    async session({ session, token, user }) {
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
    async jwt({ token, user, account }) {
      // Add access_token to the token right after signin
      user && (token.user = user);
      return token;
    },
  },
  cookies: {
    // sessionToken: {
    //   name: `__Secure-next-auth.session-token`,
    //   options: {
    //     httpOnly: true,
    //     sameSite: "lax",
    //     path: "/",
    //     secure: true,
    //   },
    // },
    // callbackUrl: {
    //   name: `__Secure-next-auth.callback-url`,
    //   options: {
    //     sameSite: "lax",
    //     path: "/",
    //     secure: true,
    //   },
    // },
    // csrfToken: {
    //   name: `__Host-next-auth.csrf-token`,
    //   options: {
    //     httpOnly: true,
    //     sameSite: "lax",
    //     path: "/",
    //     secure: true,
    //   },
    // },
  },
});
