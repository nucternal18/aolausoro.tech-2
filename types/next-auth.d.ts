import type { AdapterUser } from "next-auth/adapters";
import NextAuth from "next-auth";
import type { DefaultSession, DefaultUser } from "next-auth";
import "next-auth/jwt";

export type ExtendedUser = DefaultSession["user"] & {
  id: string | null | undefined;
  isAdmin: boolean | null | undefined;
};

export type AdapterUser = DefaultUser & {
  id: string | null | undefined;
  isAdmin: boolean | null | undefined;
};

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: ExtendedUser;
  }

  interface User extends DefaultUser {
    id: string | null | undefined;
    isAdmin: boolean | null | undefined;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** The user's role. */
    isAdmin: boolean;
    id: string;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultSession["user"] {
    id: string | null | undefined;
    isAdmin: boolean | null | undefined;
  }
}
