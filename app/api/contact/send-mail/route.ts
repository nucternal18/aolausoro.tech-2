import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { withSentry } from "@sentry/nextjs";
import validateHuman from "lib/validateHuman";
import { NextResponse } from "next/server";
import { IMessageData } from "lib/types";

export async function POST(req: Request) {
  const { name, email, subject, message, token }: IMessageData =
    await req.json();

  const isHuman = await validateHuman(token as string);
  if (!isHuman) {
    return new Response("You are not human. We can't be fooled", {
      status: 401,
    });
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
    return new Response("Invalid input. Please enter a valid input", {
      status: 400,
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

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "outlook.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.USER_EMAIL, // generated user
      pass: process.env.USER_PASS, // generated password
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: "SSLv3",
    },
    // debug: true, // show debug output
    // logger: true, // log information in console
  });

  // Setup email data with unicode symbols
  const mailOptions = {
    from: '"Adewoyin Oladipupo-Usoro" <adewoyin@aolausoro.tech>', // sender address
    to: "adewoyin@aolausoro.tech", // list of receivers
    text: "Hello?", // plain text body
    html: output, // html body
  };

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      return new Response(JSON.stringify(error), {
        status: 400,
      });
    } else {
      return "Server is ready to take our messages";
    }
  });

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return new Response(JSON.stringify(error), {
        status: 400,
      });
    }

    return `Message Sent: ${info.messageId}`;
  });

  return NextResponse.json({
    success: true,
    message: "Message sent successfully",
  });
}
