/* eslint-disable import/no-anonymous-default-export */

import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/options";

import prisma from "lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Not Authorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    select: {
      id: true,
      image: true,
      name: true,
      email: true,
      isAdmin: true,
    },
  });

  if (user) {
    return NextResponse.json(user);
  } else {
    return new Response("User not found", { status: 404 });
  }
}
