import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credential from "next-auth/providers/credentials";

import prisma from "@lib/prismadb";
import { loginSchema, type PartialUserProps } from "schema/User";
import type { User } from "@prisma/client";

export default {
  providers: [
    Credential({
      name: "aolausoro.tech",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validate = loginSchema.safeParse(credentials);

        if (!validate.success) {
          return null;
        }

        const { email, password } = validate.data;

        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (user && !user?.password) return null;

        if (
          user &&
          user.email === "adewoyin@aolausoro.tech" &&
          bcrypt.compareSync(password, user.password)
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
    error: "/auth/error",
  },
} satisfies NextAuthConfig;
