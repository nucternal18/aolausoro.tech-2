import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@lib/prismadb";
import { handlePrismaError } from "@utils/prismaErrorHandler";

export async function GET(req: NextRequest) {
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
    const wikis = await prisma.wiki.findMany();
    return NextResponse.json(wikis);
  } catch (error) {
    return handlePrismaError(error);
  }
}
