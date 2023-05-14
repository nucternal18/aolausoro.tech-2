import { Prisma } from "@prisma/client";
import prisma from "lib/prismadb";
import { IMessageData } from "types/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, subject, message, token }: IMessageData =
    await req.json();

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

  try {
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // your code
      console.error(
        "🚀 ~ file: create-message/route.ts:47 ~ POST ~ error:",
        error
      );
      return new Response("Message not created", { status: 400 });
    }
  }
}
