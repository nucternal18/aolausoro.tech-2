import { NextApiRequest, NextApiResponse } from "next";
import { projectFirestore } from '../../../lib/firebaseClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "GET") {
        let projectData = [];
        try {
            const setProject = await projectFirestore.collection("projects");
            const projects = await setProject.get();
            projects.forEach((project) => {
                const data = project.data();
               projectData.push({id: project.id, data})
            })
             res.status(200).json({
                success: true,
                id: setProject.id,
                data: projectData,
            });
        } catch (error) {
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map((val) => val);

                res.status(400).json({
                    success: false,
                    error: messages,
                });
            }
            res.status(500).json({
                success: false,
                error: "Server Error",
            });
        }
    }
}