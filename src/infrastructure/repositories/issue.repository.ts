import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialIssueProps } from "@src/entities/models/Issue";
import type { IIssuesRepository } from "@src/application/repositories/issue.repository.interface";

export class IssueRepository implements IIssuesRepository {
  constructor() {}
  async getIssueById(id: string): Promise<PartialIssueProps | undefined> {
    return await startSpan(
      { name: "IssueRepository -> getIssueById" },
      async (span) => {
        try {
          const issue = await prisma.issue.findUnique({
            where: {
              id,
            },
          });
          return issue as PartialIssueProps;
        } catch (error) {
          captureException(error);
          throw PrismaErrorHandler.handle(error);
        }
      },
    );
  }

  async getIssues(): Promise<PartialIssueProps[]> {
    return await startSpan(
      { name: "IssueRepository -> getIssues" },
      async () => {
        try {
          const issues = await prisma.issue.findMany({
            orderBy: {
              createdAt: "desc",
            },
          });
          return issues as PartialIssueProps[];
        } catch (error) {
          captureException(error);
          throw PrismaErrorHandler.handle(error);
        }
      },
    );
  }

  async createIssue(
    userId: string,
    input: PartialIssueProps,
  ): Promise<ResponseProps> {
    return await startSpan(
      { name: "IssueRepository -> createIssue" },
      async () => {
        try {
          await prisma.issue.create({
            data: {
              title: input.title as string,
              description: input.description as string,
              status: input.status,
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          });
          return { success: true, message: "Issue created successfully" };
        } catch (error) {
          captureException(error);
          throw PrismaErrorHandler.handle(error);
        }
      },
    );
  }

  async updateIssue(input: PartialIssueProps): Promise<ResponseProps> {
    return await startSpan(
      { name: "IssueRepository -> updateIssue" },
      async () => {
        try {
          await prisma.issue.update({
            where: {
              id: input.id,
            },
            data: {
              title: input.title as string,
              description: input.description as string,
              status: input.status,
            },
          });
          return { success: true, message: "Issue updated successfully" };
        } catch (error) {
          captureException(error);
          throw PrismaErrorHandler.handle(error);
        }
      },
    );
  }

  async deleteIssue(id: string): Promise<ResponseProps> {
    return await startSpan(
      { name: "IssueRepository -> deleteIssue" },
      async () => {
        try {
          await prisma.issue.delete({
            where: {
              id,
            },
          });
          return { success: true, message: "Issue deleted successfully" };
        } catch (error) {
          captureException(error);
          throw PrismaErrorHandler.handle(error);
        }
      },
    );
  }
}
