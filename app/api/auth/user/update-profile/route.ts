/* eslint-disable import/no-anonymous-default-export */
import { NextRequest, NextResponse } from "next/server";
import prisma from "lib/prismadb";
import { partialUserSchema } from "schema/User";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  const requestBody = await req.json();
  /**
   * @desc check to see if their is a user session
   */
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const validation = partialUserSchema.safeParse(requestBody);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { clerkId: userId },
    data: {
      name: requestBody.user.displayName || user.name,
      image: requestBody.user.image || user.image,
      email: requestBody.user.email || user.email,
    },
  });

  if (updatedUser) {
    return NextResponse.json({ success: true, message: "Profile updated" });
  } else {
    return new Response("Profile not updated", { status: 404 });
  }
}
