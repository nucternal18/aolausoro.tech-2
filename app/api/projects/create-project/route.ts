import prisma from "lib/prismadb";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { partialProjectSchema } from "schema/Project";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @description method to create project
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
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
  const validate = partialProjectSchema.safeParse(await req.json());

  if (!validate.success) {
    return NextResponse.json(validate.error.errors, { status: 400 });
  }

  const {
    address,
    github,
    projectName,
    techStacks,
    url,
    description,
    published,
  } = await req.json();

  const uploadedResponse = await cloudinary.uploader.upload(url, {
    upload_preset: "aolausoro_portfolio",
  });

  const createdProject = await prisma.project.create({
    data: {
      address,
      github,
      projectName,
      techStack: techStacks,
      description,
      published,
      url: uploadedResponse.secure_url,
      user: { connect: { id: user.id } },
    },
  });

  if (createdProject) {
    return NextResponse.json(createdProject);
  } else {
    return new Response("Project not created", {
      status: 400,
    });
  }
}
