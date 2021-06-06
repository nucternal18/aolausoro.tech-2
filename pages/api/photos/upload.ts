import { NextApiRequest, NextApiResponse } from 'next';
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(process.env.CLOUDINARY_API_KEY);
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'aolausoro_portfolio',
    });
    res.status(201).json(uploadedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: 'Something went wrong uploading image' });
  }
};


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}