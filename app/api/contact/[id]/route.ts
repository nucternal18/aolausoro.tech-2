/* eslint-disable import/no-anonymous-default-export */
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "lib/prismadb";

export async function GET(req: NextRequest, params: { id: string }) {
  const { userId } = getAuth(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user?.isAdmin) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      },
    );
  }
  const id = params.id;

  const message = await prisma.message.findUnique({
    where: { id: id },
  });

  if (message) {
    return NextResponse.json(message);
  } else {
    return new Response("No messages found", { status: 404 });
  }
}

export async function DELETE(req: NextRequest, params: { id: string }) {
  const { userId } = getAuth(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user?.isAdmin) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      },
    );
  }
  const id = params.id;

  const message = await prisma.message.delete({
    where: { id: id },
  });

  if (message) {
    return NextResponse.json({ success: true, message: "Message Deleted" });
  } else {
    return new Response("No messages found", { status: 404 });
  }
}
