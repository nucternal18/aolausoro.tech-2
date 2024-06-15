import prisma from "lib/prismadb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cv = await prisma.cV.findMany({
    select: {
      id: true,
      cvUrl: true,
      createdAt: true,
    },
  });

  return NextResponse.json(cv);
}
