import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import db from "lib/db";
import Message from "models/messageModel";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
    const newMessage = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    };

    await db.connectDB();
    const msg = await Message.create(newMessage);
    await db.disconnect();
    if (msg) {
      res.status(201).json({ success: true, message: "Message sent" });
    }
  } else {
    return res.status(405).json({
      success: false,
      message: "Server Error. Invalid Request",
    });
  }
};

export default withSentry(handler);
