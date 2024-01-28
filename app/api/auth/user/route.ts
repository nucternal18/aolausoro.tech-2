/* eslint-disable import/no-anonymous-default-export */
import { NextResponse } from "next/server";
import prisma from "lib/prismadb";
import { auth } from "auth";

export async function GET(req: Request) {
  const session = await auth();

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
