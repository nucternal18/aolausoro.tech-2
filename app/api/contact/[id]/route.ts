/* eslint-disable import/no-anonymous-default-export */
import { NextResponse } from "next/server";
import prisma from "lib/prismadb";
import { auth } from "auth";

export async function GET(req: Request, params: { id: string }) {
  const session = await auth();
  const id = params.id;

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

  const message = await prisma.message.findUnique({
    where: { id: id },
  });

  if (message) {
    return NextResponse.json(message);
  } else {
    return new Response("No messages found", { status: 404 });
  }
}

export async function DELETE(req: Request, params: { id: string }) {
  const session = await auth();
  const id = params.id;

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

  const message = await prisma.message.delete({
    where: { id: id },
  });

  if (message) {
    return NextResponse.json({ success: true, message: "Message Deleted" });
  } else {
    return new Response("No messages found", { status: 404 });
  }
}
