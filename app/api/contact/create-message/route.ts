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

  const { name, email, subject, message, token } = validate.data;

  try {
    const createdMessage = await prisma.message.create({
      data: {
        name: name as string,
        email: email as string,
        subject: subject as string,
        message: message as string,
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
