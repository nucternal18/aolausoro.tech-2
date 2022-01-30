import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "next-auth/react";
import db from "lib/db";
import getUser from "lib/getUser";
import Job from "models/jobsModel";
import mongoose from "mongoose";
import moment from "moment";

type StatsProps = {
  Pending: number;
  Interviewing: number;
  Declined: number;
  Offer: number;
};

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

    await db.connectDB();

    const statistic = await Job.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userData._id) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats: StatsProps = statistic.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});

    const defaultStats = {
      pending: stats.Pending || 0,
      interview: stats.Interviewing || 0,
      declined: stats.Declined || 0,
      offer: stats.Offer || 0,
    };

    const monthlyApplication = await Job.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userData._id) } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    const monthlyStats = monthlyApplication
      .map((item) => {
        const {
          _id: { year, month },
          count,
        } = item;
        const date = moment()
          .month(month - 1)
          .year(year)
          .format("MMM YYYY");
        return { date, count };
      })
      .reverse();

    await db.disconnect();

    res.status(200).json({ defaultStats, monthlyStats });
  }
};

export default withSentry(handler);
