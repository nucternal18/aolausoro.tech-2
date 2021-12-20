/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import User from "../../../models/userModel";
import db from "../../../lib/db";
import getUser from "../../../lib/getUser";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
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
    /**
     * @desc Get current user session
     */
    const userData = await getUser(req);

    await db.connectDB();

    const user = await User.findById(userData._id);

    if (user) {
      user.name = req.body.user.displayName || user.name;
      user.image = req.body.user.image || user.image;
      user.email = req.body.user.email || user.email;
      if (req.body.password) {
        user.password = req.body.user.password;
      }

      const updatedUser = await user.save();
      await db.disconnect();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        image: updatedUser.image,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        shippingAddress: updatedUser.shippingAddress,
      });
    } else {
      await db.disconnect();
      res.status(404);
      throw new Error("User not found");
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
