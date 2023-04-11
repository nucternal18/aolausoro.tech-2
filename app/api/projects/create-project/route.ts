import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
  const { address, github, projectName, techStack, url } = await req.json();

  const createdProject = await prisma.project.create({
    data: {
      address,
      github,
      projectName,
      techStack,
      url,
      user: { connect: { id: session.user.id as string } },
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
