import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "aolausoro-tech.firebaseapp.com",
  databaseURL: "https://aolausoro-tech.firebaseio.com",
  projectId: "aolausoro-tech",
  storageBucket: "aolausoro-tech.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_APP_ID,
  appId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
};

// Initialize Firebase
export const app = initializeApp(FIREBASE_CONFIG);
export const firestore = getFirestore(app);

const options = {
  site: process.env.NEXTAUTH_URL,
  // https://next-auth.js.org/providers/overview
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: FirebaseAdapter(firestore),
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    redirect({ url, baseUrl }) {
      if (url === "/api/auth/signin") {
        return Promise.resolve("/admin");
      }
      return Promise.resolve("/api/auth/signin");
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  NextAuth(req, res, options);
}
