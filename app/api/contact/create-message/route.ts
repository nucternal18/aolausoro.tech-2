import { Prisma } from "@prisma/client";
import prisma from "lib/prismadb";

import { NextResponse } from "next/server";
import validateHuman from "lib/validateHuman";

import { partialMessageSchema } from "schema/Message";

export async function POST(req: Request) {
  const validate = partialMessageSchema.safeParse(await req.json());

  if (!validate.success) {
    return NextResponse.json(validate.error.errors, { status: 400 });
  }

  const { name, email, subject, message, token } = await req.json();

  const isHuman = await validateHuman(token as string);
  if (!isHuman) {
    return new Response("You are not human. We can't be fooled", {
      status: 401,
    });
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
      console.error(error);
      return new Response("Message not created", { status: 400 });
    }
  }
}
