/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "lib/db";
import getUser from "lib/getUser";
import Message from "models/messageModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
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

  if (req.method === "GET") {
    /**
     * @desc get a message
     * @route GET /api/contact/:id
     * @access Public
     */
    await db.connectDB();

    const message = await Message.findOne({ _id: id });

    await db.disconnect();
    res.status(200).json(message);
  } else if (req.method === "DELETE") {
    /**
     * @desc delete a message
     * @route DELETE /api/contact/:id
     * @access Private
     */

    await db.connectDB();
    try {
      const message = await Message.findOne({ _id: id });

      if (userData.isAdmin) {
        await message.remove();
        await db.disconnect();
        res.status(201).json({ message: "Message Deleted" });
      }
    } catch (error) {
      res.status(404).json({ message: "Unable to delete message", error });
      throw new Error("Message not found");
    }
  } else {
    res.status(405).json({
      success: false,
      error: "Server Error. Invalid Request",
    });
  }
};
