import nodemailer from "nodemailer";
import validateHuman from "lib/validateHuman";
import { NextResponse } from "next/server";
import resend from "@lib/resend";

import { partialMessageSchema } from "schema/Message";

export async function POST(req: Request) {
  const validate = partialMessageSchema.safeParse(await req.json());

  if (!validate.success) {
    return NextResponse.json(validate.error.errors, { status: 400 });
  }

  const { name, email, subject, message, token } = validate.data;

  const isHuman = await validateHuman(token as string);

  if (!isHuman) {
    return new Response("You are not human. We can't be fooled", {
      status: 401,
    });
  }

  const output = `
                        <p>You have a new contact request</p>
                        <h3>Contact Details</h3>
                        <ul>
                            <li>Name: ${name}</li>
                            <li>Email: ${email}</li>
                            <li>Subject: ${subject}</li>
                        </ul>
                        <h3>Message</h3>
                        <p>${message}</p>
                    `;

  const { data, error } = await resend.emails.send({
    from: "email@mail.aolausoro.tech",
    to: "adewoyin@aolausoro.tech",
    subject: subject as string,
    html: output,
  });

  if (error) {
    console.error(error);
    return new Response("Message not sent", { status: 400 });
  }
  // verify connection configuration

  return NextResponse.json({
    success: true,
    message: "Message sent successfully",
    data,
  });
}
