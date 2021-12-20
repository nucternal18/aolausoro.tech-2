import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { defaultFirestore, initialAuth } from "lib/firebaseAdmin";
import { getSession } from "next-auth/react";
import getUser from "lib/getUser";
import db from "lib/db";
import Message from "models/messageModel";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
    /**
     * @desc Get all messages
     * @route GET /api/contact/getMessages
     * @access Private
     */
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      console.error(
        "No  token was passed as a Bearer token in the Authorization header.",
        "Make sure you authorize your request by providing the following HTTP header:",
        "Authorization: Bearer <ID Token>"
      );
      res.status(403).json({ message: "No token provided. Not Authorized " });
      return;
    }
    /**
     * @desc Get user session
     */
    const session = await getSession({ req });
    /**
     * @desc check to see if their is a user session
     */
    if (!session) {
      res.status(401).json({ message: "Not Authorized" });
      return;
    }

    const userData = await getUser(req);

    if (!userData.isAdmin) {
      res.status(401).json({
        message:
          "Not Authorized. You do not have permission to perform this operation.",
      });
      return;
    }
    await db.connectDB();

    const messages = await Message.find({});

    await db.disconnect();

    res.status(200).json(messages);
  } else {
    res.status(405).json({
      success: false,
      error: "Server Error. Invalid Request",
    });
  }
};

export default withSentry(handler);
