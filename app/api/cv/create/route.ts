import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import prisma from "lib/prismadb";

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

  const { cvUrl } = await req.json();

  if (!cvUrl || cvUrl.trim() === "") {
    return new Response("Invalid input", { status: 400 });
  }

  const createdCV = await prisma.cV.create({
    data: {
      cvUrl: cvUrl,
      user: { connect: { id: user.id } },
    },
  });

  if (createdCV) {
    return NextResponse.json({
      success: true,
      message: "CV created successfully",
    });
  } else {
    return NextResponse.json("Job not created", { status: 404 });
  }
}
