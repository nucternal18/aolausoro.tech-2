import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type {
  PartialJobProps,
  DefaultStatsProps,
  StatsProps,
} from "@src/entities/models/Job";
import type { IJobsRepository } from "@src/application/repositories/job.repository.interface";
import type { Prisma } from "@prisma/client";
import moment from "moment";

type MonthlyApplicationStatProps = {
  _id: {
    year: number;
    month: number;
  };
  count: number;
};

@injectable()
export class JobRepository implements IJobsRepository {
  constructor() {}
  async getStats(id: string): Promise<StatsProps | undefined> {
    return await startSpan({ name: "JobRepository -> Get Stats" }, async () => {
      try {
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

        const defaultStats: DefaultStatsProps = {
          pending: pendingStats || 0,
          interviewing: interviewStats || 0,
          declined: declinedStats || 0,
          offer: offerStats || 0,
        };

        /**
         * Retrieves the monthly applications statistics for a user.
         * @returns {Prisma.JsonArray} The aggregated monthly applications statistics.
         */
        const monthlyApplications = (await prisma.job.aggregateRaw({
          pipeline: [
            { $match: { createdBy: id } },
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
          JSON.stringify(monthlyApplications),
        );

        const monthlyApplicationStats = monthlyApplicationDSta.map(
          (item: MonthlyApplicationStatProps) => {
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
        return {
          defaultStats,
          monthlyApplicationStats,
        };
      } catch (error) {
        captureException(error);

        throw PrismaErrorHandler.handle(error);
      }
    });
  }

  async getJobs(): Promise<PartialJobProps[] | undefined> {
    return await startSpan({ name: "JobRepository -> Get Jobs" }, async () => {
      try {
        const jobs = await prisma.job.findMany();

        return jobs;
      } catch (error) {
        captureException(error);

        throw PrismaErrorHandler.handle(error);
      }
    });
  }

  async getJobById(id: string): Promise<PartialJobProps | undefined> {
    return await startSpan(
      { name: "JobRepository -> Get Job By Id" },
      async () => {
        try {
          const job = await prisma.job.findUnique({ where: { id } });

          return job as PartialJobProps;
        } catch (error) {
          captureException(error);

          throw PrismaErrorHandler.handle(error);
        }
      },
    );
  }

  async createJob(
    userId: string,
    input: PartialJobProps,
  ): Promise<ResponseProps> {
    return await startSpan(
      { name: "JobRepository -> Create Job" },
      async () => {
        try {
          await prisma.job.create({
            data: {
              company: input.company as string,
              position: input.position as string,
              createdBy: userId,
              status: input.status as string,
              user: { connect: { id: userId } },
              jobLocation: input.jobLocation as string,
              jobType: input.jobType as string,
            },
          });

          return { success: true, message: "Job created successfully" };
        } catch (error) {
          captureException(error);

          throw PrismaErrorHandler.handle(error);
        }
      },
    );
  }

  async updateJob(input: PartialJobProps): Promise<ResponseProps> {
    return await startSpan(
      { name: "JobRepository -> Update Job" },
      async () => {
        try {
          await prisma.job.update({
            where: { id: input.id as string },
            data: {
              company: input.company as string,
              position: input.position as string,
              status: input.status as string,
              jobLocation: input.jobLocation as string,
              jobType: input.jobType as string,
            },
          });

          return { success: true, message: "Job updated successfully" };
        } catch (error) {
          captureException(error);

          throw PrismaErrorHandler.handle(error);
        }
      },
    );
  }

  async deleteJob(id: string): Promise<ResponseProps> {
    return await startSpan(
      { name: "JobRepository -> Delete Job" },
      async () => {
        try {
          await prisma.job.delete({ where: { id } });

          return { success: true, message: "Job deleted successfully" };
        } catch (error) {
          captureException(error);

          throw PrismaErrorHandler.handle(error);
        }
      },
    );
  }
}
