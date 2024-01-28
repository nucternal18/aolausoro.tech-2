import { NextResponse } from "next/server";
import prisma from "lib/prismadb";
import { auth } from "auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
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
  const id = params.id;

  const foundJob = await prisma.job.findUnique({
    where: { id: id },
  });

  if (foundJob) {
    return NextResponse.json(foundJob, { status: 200 });
  } else {
    return NextResponse.json("Job not found", { status: 404 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
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

  const id = params.id;

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
    return new Response("Invalid input. Please provide correct inputs", {
      status: 400,
    });
  }

  const foundJob = await prisma.job.findUnique({
    where: { id: id },
  });

  if (foundJob) {
    await prisma.job.update({
      where: { id: id },
      data: {
        company: company,
        position: position,
        status: status,
        jobLocation: jobLocation,
        jobType: jobType,
        user: { connect: { id: session.user.id  } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
    });
  } else {
    return new Response("Job not found", { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
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

  const id = params.id;

  const foundJob = await prisma.job.findUnique({
    where: { id: id },
  });

  if (foundJob) {
    await prisma.job.delete({
      where: { id: id },
    });

    return NextResponse.json({
      success: true,
      message: "Job deleted successfully",
    });
  } else {
    return new Response(`No Job with id:${id} found`, { status: 404 });
  }
}
