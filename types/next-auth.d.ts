import NextAuth, { DefaultSession, Session } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  type Session = {
    user: {
      id: string | null | undefined;
      isAdmin: boolean | null | undefined;
    } & DefaultSession["user"];
    expires: ISODateString;
  };

  // type User = {
  //   id: string | null | undefined;
  //   isAdmin: boolean | null | undefined;
  // } & DefaultSession["user"];
}

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    role: "admin";
    isAdmin: boolean;
    user: Session["user"];
  }
}
