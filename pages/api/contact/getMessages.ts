
import { NextApiRequest, NextApiResponse } from "next";
import { projectFirestore, timestamp } from '../../../lib/firebaseClient';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
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
      createdAt: timestamp(),
    };

    try {
      const messageRef = await projectFirestore.collection("messages").get();
      const messageArray = [];
      messageRef.forEach((doc) => {
        messageArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      if (messageRef.empty) {
        const messageDocRef = projectFirestore.collection("messages").doc();
        await messageDocRef.set(Message);
        return messageDocRef;
      }
      res.status(200).json({
        success: true,
        data: messageArray,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }

  } else {
    res.status(405).json({
      success: false,
      error: "Server Error. Invalid Request",
    });
  }
};
