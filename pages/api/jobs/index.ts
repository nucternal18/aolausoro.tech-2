import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "next-auth/react";
import Job from "models/jobsModel";
import db from "lib/db";
import getUser from "lib/getUser";

type QueryObjProps = {
  createdBy: string;
  status?: string | string[];
  jobType?: string | string[];
  position?: { $regex: string | string[]; $options: string };
};

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
    const { status, jobType, sort, search } = req.query;

    const queryObj: QueryObjProps = {
      createdBy: userData._id,
    };
    if (status && status !== "all") {
      queryObj.status = status;
    }
    if (jobType && jobType !== "all") {
      queryObj.jobType = jobType;
    }

    if (search) {
      queryObj.position = { $regex: search, $options: "i" };
    }
    await db.connectDB();

    // No await here because we don't need to wait for the query to finish
    let result = Job.find(queryObj);
    let page: number;
    // Chain sort conditions
    if (sort === "latest") {
      result = result.sort("-createdAt");
    }
    if (sort === "oldest") {
      result = result.sort("createdAt");
    }
    if (sort === "a-z") {
      result = result.sort("position");
    }
    if (sort === "z-a") {
      result = result.sort("-position");
    }

    //Pagination

    if (Number(req.query.page) > 1) {
      page = Number(req.query.page);
    } else {
      page = 1;
    }
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const jobs = await result;

    const totalJobs = await Job.countDocuments(queryObj);
    const numberOfPages = Math.ceil(totalJobs / limit);

    await db.disconnect();

    res.status(200).json({ jobs, totalJobs, numberOfPages });
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
