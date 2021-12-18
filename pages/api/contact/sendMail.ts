import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { withSentry } from "@sentry/nextjs";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { name, email, subject, message } = req.body;

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
      res.status(422).json({ message: "Invalid input" });
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
        return error;
      } else {
        return "Server is ready to take our messages";
      }
    });

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      }

      return `Message Sent: ${info.messageId}`;
    });

    res.status(201).json({ message: "Message sent successfully" });
  } else {
    return res.status(405).json({
      success: false,
      error: "Server Error. Invalid Request",
    });
  }
};

export default withSentry(handler);
