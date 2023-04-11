import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
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

export async function GET(req: Request) {
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

  const monthlyApplicationDSta = JSON.parse(
    JSON.stringify(monthlyApplications)
  );

  const monthlyApplicationStats = monthlyApplicationDSta.map((item) => {
    const {
      _id: { year, month },
      totalPrice,
    } = item;
    const date = moment()
      .month(month - 1)
      .year(year)
      .format("MMM YYYY");
    return { date, totalPrice };
  });

  if (monthlyApplications) {
    return NextResponse.json({ defaultStats, monthlyApplicationStats });
  } else {
    return new Response("No job stats found", { status: 404 });
  }
}
