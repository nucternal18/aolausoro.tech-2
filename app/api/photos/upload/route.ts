import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

import { NextResponse } from "next/server";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { data } = await req.json();

  if (!session) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      }
    );
  }

  if (!session.user.isAdmin) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      }
    );
  }

  try {
    const uploadedResponse = await cloudinary.uploader.upload(data, {
      upload_preset: "aolausoro_portfolio",
    });
    return NextResponse.json(uploadedResponse.secure_url);
  } catch (error) {
    console.error(error);
    return new Response("Something went wrong uploading image", {
      status: 500,
    });
  }
}
