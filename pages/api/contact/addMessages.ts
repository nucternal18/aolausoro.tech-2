import { NextApiRequest, NextApiResponse } from "next";
import { projectFirestore, timestamp } from '../../../firebase/firebaseClient';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const Message = {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        createdAt: timestamp(),
    };

    try {
        const setMessages = await projectFirestore.collection("messages").add(Message);
        const messages = await setMessages.get();
        return res.status(200).json({
            success: true,
            id: setMessages.id,
            data: messages.data(),
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map((val) => val);

            return res.status(400).json({
                success: false,
                error: messages,
            });
        }
        return res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
 }