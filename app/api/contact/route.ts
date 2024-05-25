import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@lib/prismadb";

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);

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

  const messages = await prisma.message.findMany({});

  if (messages) {
    return NextResponse.json(messages);
  } else {
    return new Response("No messages found", { status: 404 });
  }
}
