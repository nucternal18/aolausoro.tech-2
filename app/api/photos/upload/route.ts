import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@lib/prismadb";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const { data } = await req.json();

  const { userId } = getAuth(req);

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user?.isAdmin) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      },
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
