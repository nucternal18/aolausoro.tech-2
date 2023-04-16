/* eslint-disable import/no-anonymous-default-export */
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

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
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

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
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

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
