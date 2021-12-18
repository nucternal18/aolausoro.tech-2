import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "GET") {
    /**
     * @desc Get all messages
     * @route GET /api/contact/getMessages
     * @access Private
     */
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      console.error(
        "No Firebase ID token was passed as a Bearer token in the Authorization header.",
        "Make sure you authorize your request by providing the following HTTP header:",
        "Authorization: Bearer <Firebase ID Token>"
      );
      res.status(403).json({ message: "No token provided. Not Authorized " });
      return;
    }
    const idToken = req.headers.authorization.split(" ")[1];

    let userData;
    const token = await getAuth().verifyIdToken(idToken);

    const userRef = getFirestore().collection("users").doc(token.uid);
    const snapshot = await userRef.get();
    snapshot.exists ? (userData = snapshot.data()) : (userData = null);

    if (!userData.isAdmin) {
      res.status(401).json({
        message:
          "Not Authorized. You do not have permission to perform this operation.",
      });
      return;
    }

    try {
      const messageRef = await getFirestore().collection("messages").get();
      const messageArray = [];
      messageRef.forEach((doc) => {
        messageArray.push({
          id: doc.id,
          data: doc.data(),
        });
      });

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

export default withSentry(handler);
