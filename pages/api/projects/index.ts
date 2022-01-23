/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "next-auth/react";
import db from "lib/db";
import Project from "models/projectModel";
import getUser from "lib/getUser";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
  } else if (req.method === "POST") {
    /**
     * @desc create a new project
     * @route POST /api/projects
     * @access Private
     */

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

    const { address, github, projectName, techStack, url } = req.body;

    const newProject = new Project({
      user: userData._id,
      address,
      github,
      projectName,
      techStack,
      url,
    });

    await db.connectDB();

    await newProject.save();

    await db.disconnect();

    res.status(201).json(newProject);
  } else {
    res.status(405).json({
      success: false,
      error: "Server Error. Invalid Request",
    });
  }
};

export default withSentry(handler);
