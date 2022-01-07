/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import User from "../../../models/userModel";
import db from "../../../lib/db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * @desc Get user profile
   * @route GET /api/users/profile
   * @access Private
   */
  if (req.method === "GET") {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).json({ message: "Not Authorized" });
      return;
    }

    await db.connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (user) {
      res.status(200).json({
        _id: user._id,
        image: user.image,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        shippingAddress: user.shippingAddress,
      });
    } else {
      res.status(404).json({ message: "User not found" });
      throw new Error("User not found");
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
