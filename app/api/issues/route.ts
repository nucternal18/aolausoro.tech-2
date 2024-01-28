import { NextRequest, NextResponse } from "next/server";
import { partialIssueSchema } from "schema/Issue";
import prisma from "@lib/prismadb";
import { auth } from "auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = partialIssueSchema.safeParse(body);

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

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  try {
    const createdIssue = await prisma.issue.create({
      data: {
        title: body.title,
        description: body.description,
        user: {
          connect: {
            id: session.user.id ,
          },
        },
      },
    });

    return NextResponse.json(createdIssue, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
