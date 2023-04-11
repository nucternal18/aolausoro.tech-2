import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { name, email, subject, message, token } = await req.json();

  if (!session) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      }
    );
  }

  if (!session.user.isAdmin) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      }
    );
  }

  if (
    !email ||
    !email.includes("@") ||
    !name ||
    name.trim() === "" ||
    !subject ||
    subject.trim() === "" ||
    !message ||
    message.trim() === ""
  ) {
    return new Response("Invalid input", { status: 400 });
  }

  const createdMessage = await prisma.message.create({
    data: {
      name: name,
      email: email,
      subject: subject,
      message: message,
    },
  });

  if (createdMessage) {
    return NextResponse.json({
      success: true,
      message: "Message created successfully",
    });
  } else {
    return new Response("Message not created", { status: 404 });
  }
}
