
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
    return res.status(200).json({
      success: true,
      data: messageArray,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
