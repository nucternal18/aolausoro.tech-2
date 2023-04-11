import NextAuth, { DefaultSession, Session } from "next-auth";

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
}
