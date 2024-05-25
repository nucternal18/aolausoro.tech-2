/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prismadb";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
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
