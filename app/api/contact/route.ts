import { NextResponse } from "next/server";
import { auth } from "auth";
import prisma from "@lib/prismadb";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      },
    );
  }

  if (!session.user.isAdmin) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      },
    );
  }

  const messages = await prisma.message.findMany({});

  if (messages) {
    return NextResponse.json(messages);
  } else {
    return new Response("No messages found", { status: 404 });
  }
}
