import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { withSentry } from "@sentry/nextjs";
import { defaultFirestore } from '../../../lib/firebaseAdmin';
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    /**
     * @desc upload an image to cloudinary
     * @route POST /api/photos/upload
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

    try {
      let userData;
      const token = await getAuth().verifyIdToken(idToken);

      const userRef = defaultFirestore.collection("users").doc(token.uid);
      const snapshot = await userRef.get();
      snapshot.exists ? (userData = snapshot.data()) : (userData = null);

      if (!userData.isAdmin) {
        res
          .status(401)
          .json({
            message:
              "Not Authorized. You do not have permission to perform this operation.",
          });
        return;
      }
      const fileStr = req.body.data;
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'aolausoro_portfolio',
      });
      res.status(201).json(uploadedResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ err: 'Something went wrong uploading image' });
    }
  } else {
    return res.status(500).json({
      success: false,
      error: "Server Error. Invalid Request",
    });
  }
};


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export default withSentry(handler);