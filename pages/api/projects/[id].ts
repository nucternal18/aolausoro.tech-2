/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import db from "lib/db";
import Project from "models/projectModel";
import { getSession } from "next-auth/react";
import getUser from "lib/getUser";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });

  if (req.method === "GET") {
    /**
     * @desc get a project
     * @route GET /api/projects/:id
     * @access Public
     */
    await db.connectDB();

    const projects = await Project.findOne({ _id: id });

    await db.disconnect();
    res.status(200).json(projects);
  } else if (req.method === "PUT") {
    /**
     * @desc update a project
     * @route PUT /api/projects/:id
     * @access Private
     */
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
    const { address, github, projectName, techStack, url } = req.body;
    const project = await Project.findOne({ _id: id });

    if (project) {
      project.address = address;
      project.github = github;
      project.projectName = projectName;
      project.techStack = techStack;
      project.url = url;

      const updatedProject = await project.save();
      await db.disconnect();

      res.status(201).json(updatedProject);
    } else {
      res.status(404);
      throw new Error("Project not found");
    }
  } else if (req.method === "DELETE") {
    /**
     * @desc delete a project
     * @route DELETE /api/projects/:id
     * @access Private
     */

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
    try {
      const project = await Project.findOne({ _id: id });

      if (project.user === userData._id && userData.isAdmin) {
        await project.remove();
        await db.disconnect();
        res.status(201).json({ message: "Project removed" });
      }
    } catch (error) {
      res.status(404).json({ message: "Unable to delete project", error });
      throw new Error("Product not found");
    }
  } else {
    res.status(405).json({
      success: false,
      error: "Server Error. Invalid Request",
    });
  }
};
