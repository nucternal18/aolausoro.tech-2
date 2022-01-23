import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "next-auth/react";
import db from "lib/db";
import getUser from "lib/getUser";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
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
  }
};

export default withSentry(handler);
