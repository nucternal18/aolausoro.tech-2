/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import db from "lib/db";
import Project from "models/projectModel";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    /**
     * @desc get all projects
     * @route GET /api/projects
     * @access Public
     */
    await db.connectDB();

    const projects = await Project.find({});

    await db.disconnect();
    res.status(200).json(projects);
  } else {
    res.status(405).json({
      success: false,
      error: "Server Error. Invalid Request",
    });
  }
};
