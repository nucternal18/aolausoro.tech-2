import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "lib/prismadb";
import { NextResponse } from "next/server";

type QueryObjProps = {
  [k: string]: string;
};

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);

  const queryItems: QueryObjProps = Object.fromEntries(searchParams.entries());

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

  const { status, jobType, sort, search, page, limit } = queryItems;

  const queryObj: QueryObjProps = {
    createdBy: session.user.id as string,
  };
  if (status && status !== "all") {
    queryObj.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObj.jobType = jobType;
  }

  let currentPage: number;
  if (Number(page) > 1) {
    currentPage = Number(page);
  } else {
    currentPage = 1;
  }
  const pageLimit = Number(limit) || 10;
  const skip = (currentPage - 1) * pageLimit;

  const result = await prisma.job.findMany({
    where: {
      createdBy: queryObj.createdBy,
      status: queryObj.status,
      jobType: queryObj.jobType,
    },
    orderBy: {
      createdAt: sort === "latest" ? "asc" : "desc",
      position: sort === "a-z" ? "asc" : "desc",
    },
    skip: skip,
    take: pageLimit,
  });

  const totalJobs = result.length;
  const numberOfPages = Math.ceil(totalJobs / pageLimit);

  if (result) {
    return NextResponse.json({
      jobs: result,
      totalJobs,
      numberOfPages,
    });
  } else {
    return new Response("No jobs found", { status: 404 });
  }
}
