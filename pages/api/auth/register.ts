import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import User from "../../../models/userModel";

import db from "../../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { displayName, password, email, isAdmin, image } = req.body;

    if (
      !displayName ||
      !password ||
      password.trim().length < 7 ||
      !email ||
      !email.includes("@")
    ) {
      res.status(422).send({
        message: "Invalid inputs - password should be at least 7 characters",
      });
      return;
    }
    await db.connectDB();

    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(422).json({ message: "User already exists" });
      await db.disconnect();
      return;
    }

    const user = await User.create({
      name: displayName,
      email,
      password,
      image: image,
      isAdmin,
    });
    await db.disconnect();
    if (user) {
      res
        .status(201)
        .json({ success: true, message: "Created user successfully" });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default withSentry(handler);
