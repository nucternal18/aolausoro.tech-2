import { collection } from "@firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { defaultFirestore, Timestamp } from '../../../lib/firebaseAdmin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") {

        const { name, email, subject, message } = req.body;
        if (
            !email ||
            !email.includes("@") ||
            !name || name.trim() === '' ||
            !subject ||
            subject.trim() === '' ||
            !message ||
            message.trim() === ''
        ) {
            res.status(422).json({ message: "Invalid input" })
        }
        const Message = {
            name: name,
            email: email,
            subject: subject,
            message: message,
            createdAt: Timestamp.now(),
        };

        try {
            const setMessages = await defaultFirestore.collection("messages").add(Message);
            const messages = await setMessages.get();
            return res.status(200).json({
                success: true,
                id: setMessages.id,
                data: messages.data(),
            });
        } catch (err) {
            if (err.name === "ValidationError") {
                const messages = Object.values(err.errors).map((val) => val);

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
    } else {
        return res.status(405).json({
            success: false,
            error: "Server Error. Invalid Request",
        });
    }
}