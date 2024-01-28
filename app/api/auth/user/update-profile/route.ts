/* eslint-disable import/no-anonymous-default-export */
import { NextResponse } from "next/server";
import prisma from "lib/prismadb";
import { partialUserSchema } from "schema/User";
import { auth } from "auth";

export async function POST(req: Request) {
  const session = await auth();
  const requestBody = await req.json();
  /**
   * @desc check to see if their is a user session
   */
  if (!session) {
    return new Response("Not Authorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id ,
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const validation = partialUserSchema.safeParse(requestBody);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: session.user.id ,
    },
    data: {
      name: requestBody.user.displayName || user.name,
      image: requestBody.user.image || user.image,
      email: requestBody.user.email || user.email,
      password: (requestBody.password && requestBody.password) || user.password,
    },
  });

  if (updatedUser) {
    return NextResponse.json({ success: true, message: "Profile updated" });
  } else {
    return new Response("Profile not updated", { status: 404 });
  }
}
