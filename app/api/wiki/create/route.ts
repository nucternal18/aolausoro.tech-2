import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@lib/prismadb";
import { wikiSchema, partialWikiSchema } from "schema/Wiki";
import { handlePrismaError } from "@utils/prismaErrorHandler";

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  const data = await req.json();
  console.log("🚀 ~ api/wiki/create ~ POST ~ data:", data);

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

  const { description, title, isImage, imageUrl } =
    partialWikiSchema.parse(data);

  const createdWiki = await prisma.wiki.create({
    data: {
      description: description as string,
      title: title as string,
      isImage,
      imageUrl,
      user: { connect: { id: user.id } },
    },
  });

  if (createdWiki) {
    return NextResponse.json({
      success: true,
      message: "Wiki created successfully",
    });
  } else {
    return NextResponse.json("Wiki not created", { status: 404 });
  }
}
