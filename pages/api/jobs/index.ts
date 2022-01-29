import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "next-auth/react";
import Job from "models/jobsModel";
import db from "lib/db";
import getUser from "lib/getUser";

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
    const jobs = await Job.find({ createdBy: userData._id });
    await db.disconnect();
    res.status(200).json({ jobs, totalJobs: jobs.length, numberOfPages: 1 });
  } else if (req.method === "POST") {
    const { company, position } = req.body;
    if (!company || !position) {
      res.status(400).json({ message: "Please provide company and position" });
      return;
    }
    await db.connectDB();
    req.body.createdBy = userData._id;
    const job = new Job(req.body);
    await job.save();
    await db.disconnect();
    res.status(201).json({ job });
  } else {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
};

export default withSentry(handler);
