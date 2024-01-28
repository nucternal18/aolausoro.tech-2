import { NextResponse } from "next/server";
import prisma from "lib/prismadb";
import { auth } from "auth";

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      },
    );
  }

  if (!session.user.isAdmin) {
    return new Response(
      "Not Authorized. You do not have permission to perform this operation.",
      {
        status: 401,
      },
    );
  }
  const { company, position, status, jobLocation, jobType } = await req.json();

  if (
    !company ||
    company.trim() === "" ||
    !position ||
    position.trim() === "" ||
    !status ||
    status.trim() === "" ||
    !jobLocation ||
    jobLocation.trim() === "" ||
    !jobType ||
    jobType.trim() === ""
  ) {
    return new Response("Invalid input", { status: 400 });
  }

  const createdJob = await prisma.job.create({
    data: {
      company: company,
      position: position,
      createdBy: session.user.id ,
      status: status,
      user: { connect: { id: session.user.id  } },
      jobLocation: jobLocation,
      jobType: jobType,
    },
  });

  if (createdJob) {
    return NextResponse.json({
      success: true,
      message: "Job created successfully",
    });
  } else {
    return NextResponse.json("Job not created", { status: 404 });
  }
}
