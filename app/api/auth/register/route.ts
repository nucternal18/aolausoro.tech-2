import { NextApiRequest, NextApiResponse } from "next";

import prisma from "lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { displayName, password, email, isAdmin, image } = await request.json();

  if (
    !displayName ||
    !password ||
    password.trim().length < 7 ||
    !email ||
    !email.includes("@")
  ) {
    return new Response(
      "Invalid inputs - password should be at least 7 characters",
      {
        status: 400,
      }
    );
  }

  const userExist = await prisma.user.findUnique({ where: { email } });

  if (userExist) {
    return new Response("User already exists", {
      status: 404,
    });
  }

  const user = await prisma.user.create({
    data: { name: displayName, email, password, image: image, isAdmin },
  });
  await prisma.$disconnect();

  if (user) {
    return NextResponse.json({ message: "User created", success: true });
  } else {
    return new Response("User not created", { status: 404 });
  }
}
