import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "next-auth/react";
import db from "lib/db";
import getUser from "lib/getUser";
import Job from "models/jobsModel";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
  if (req.method === "GET") {
    await db.connectDB();

    const job = await Job.findOne({ _id: req.query.id });
    if (!job) {
      res.status(404).json({ message: `No Job with ${req.query.id} found` });
      return;
    }
    await db.disconnect();

    res.status(200).json({ job });
  } else if (req.method === "PUT") {
    const { company, position } = req.body;

    if (!company || !position) {
      res.status(400).json({ message: "Please provide all values" });
      return;
    }

    await db.connectDB();

    const job = await Job.findOne({ _id: req.query.id });

    if (!job) {
      res.status(404).json({ message: `No Job with ${req.query.id} found` });
      return;
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.query.id },
      req.body,
      { new: true, runValidators: true }
    );

    await db.disconnect();

    res.status(201).json({ updatedJob });
  } else if (req.method === "DELETE") {
    await db.connectDB();

    const job = await Job.findOne({ _id: req.query.id });

    if (!job) {
      res.status(404).json({ message: `No Job with ${req.query.id} found` });
      return;
    }

    await job.remove();

    await db.disconnect();

    res.status(201).json({ msg: "Job deleted successfully" });
  } else {
    res
      .status(405)
      .json({ success: false, error: "Server Error. Invalid Request" });
    return;
  }
};

export default withSentry(handler);
