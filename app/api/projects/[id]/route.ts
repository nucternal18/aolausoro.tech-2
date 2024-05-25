/* eslint-disable import/no-anonymous-default-export */
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "lib/prismadb";
import { partialProjectSchema } from "schema/Project";

/**
 * @description method to get a project by id
 * @param req
 * @returns
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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

  const projectId = params.id;
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (project) {
    return NextResponse.json(project);
  } else {
    return new Response("No project found", {
      status: 400,
    });
  }
}

/**
 * @description method to update project
 * @param req
 * @param param1
 * @returns
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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

  const projectId = params.id;

  const {
    address,
    github,
    projectName,
    techStacks,
    url,
    description,
    published,
  } = await req.json();

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (project) {
    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        address: address || project.address,
        github: github || project.github,
        projectName: projectName || project.projectName,
        techStack: techStacks || project.techStack,
        url: url || project.url,
        description: description || project.description,
        published: published,
      },
    });

    return NextResponse.json({ success: true, message: "Project updated" });
  } else {
    return new Response("Project not found. Please choose the right project.", {
      status: 400,
    });
  }
}

/**
 * @description method to delete project
 * @param req
 * @param param1
 * @returns
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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

  const projectId = params.id;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (project) {
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({ success: true, message: "Project deleted" });
  } else {
    return new Response("Project not found. Please choose the right project.", {
      status: 400,
    });
  }
}
