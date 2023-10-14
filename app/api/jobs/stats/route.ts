import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "lib/prismadb";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import moment from "moment";

type StatsProps = {
  pending: number;
  interviewing: number;
  declined: number;
  offer: number;
};

type MonthlyApplicationDStaProps = {
  _id: {
    year: number;
    month: number;
  };
  count: number;
};

type MonthlyApplicationStatsProps = {
  date: string;
  count: number;
};

/**
 * @description method to get jobs and stats
 * @param req
 * @returns
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

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

  const pendingStats = await prisma.job.count({
    where: {
      status: "Pending",
    },
  });

  const interviewStats = await prisma.job.count({
    where: {
      status: "Interviewing",
    },
  });

  const declinedStats = await prisma.job.count({
    where: {
      status: "Declined",
    },
  });

  const offerStats = await prisma.job.count({
    where: {
      status: "Offer",
    },
  });

  const defaultStats: StatsProps = {
    pending: pendingStats || 0,
    interviewing: interviewStats || 0,
    declined: declinedStats || 0,
    offer: offerStats || 0,
  };

  const monthlyApplications = (await prisma.job.aggregateRaw({
    pipeline: [
      { $match: { createdBy: session.user.id } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ],
  })) as unknown as Prisma.JsonArray;
  // console.log(
  //   "🚀 ~ file: route.ts:84 ~ GET ~ monthlyApplications:",
  //   monthlyApplications
  // );

  const monthlyApplicationDSta = JSON.parse(
    JSON.stringify(monthlyApplications),
  );
  // console.log(
  //   "🚀 ~ file: route.ts:88 ~ GET ~ monthlyApplicationDSta:",
  //   monthlyApplicationDSta
  // );

  const monthlyApplicationStats = monthlyApplicationDSta.map(
    (item: MonthlyApplicationDStaProps) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM YYYY");
      return { date, count };
    },
  );
  // console.log(
  //   "🚀 ~ file: route.ts:100 ~ monthlyApplicationStats ~ monthlyApplicationStats:",
  //   monthlyApplicationStats
  // );

  if (monthlyApplications) {
    return NextResponse.json({ defaultStats, monthlyApplicationStats });
  } else {
    return new Response("No job stats found", { status: 404 });
  }
}
