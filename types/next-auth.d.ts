import type { AdapterUser } from "next-auth/adapters";
import NextAuth from "next-auth";
import type { DefaultSession, Session, DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: {
      id: string | null | undefined;
      isAdmin: boolean | null | undefined;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
  }

  interface User extends DefaultUser {
    id: string | null | undefined;
    isAdmin: boolean | null | undefined;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    role: "admin";
    isAdmin: boolean;
    user: {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultSession["user"] {
    id: string | null | undefined;
    isAdmin: boolean | null | undefined;
  }
}
