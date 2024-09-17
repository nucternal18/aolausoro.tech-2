import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialProjectProps } from "@src/entities/models/Project";
import type { IProjectRepository } from "@src/application/repositories/project.repository.interface";

@injectable()
export class ProjectRepository implements IProjectRepository {
  async getProjects(): Promise<PartialProjectProps[] | undefined> {
    return await startSpan(
      { name: "ProjectRepository > getProject" },
      async () => {
        try {
          const project = prisma.project.findMany({
            orderBy: { createdAt: "desc" },
          });

          return project as Promise<PartialProjectProps[] | undefined>;
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async getProjectById(id: string): Promise<PartialProjectProps | undefined> {
    return await startSpan(
      { name: "ProjectRepository > getProjectById" },
      async () => {
        try {
          const project = prisma.project.findUnique({
            where: { id },
          });

          return project as Promise<PartialProjectProps | undefined>;
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async createProject(
    input: PartialProjectProps & { userId: string },
  ): Promise<ResponseProps> {
    return await startSpan(
      { name: "ProjectRepository > createProject" },
      async () => {
        try {
          await prisma.project.create({
            data: {
              address: input.address as string,
              github: input.github as string,
              projectName: input.projectName as string,
              description: input.description as string,
              published: input.published as boolean,
              techStack: input.techStack,
              url: input.url as string,
              user: { connect: { id: input.userId } },
            },
          });

          return { success: true, message: "Project created successfully" };
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async updateProject(input: PartialProjectProps): Promise<ResponseProps> {
    return await startSpan(
      { name: "ProjectRepository > updateProject" },
      async () => {
        try {
          await prisma.project.update({
            where: { id: input.id },
            data: {
              address: input.address as string,
              github: input.github as string,
              projectName: input.projectName as string,
              description: input.description as string,
              published: input.published as boolean,
              techStack: input.techStack,
              url: input.url as string,
            },
          });

          return { success: true, message: "Project updated successfully" };
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async deleteProject(id: string): Promise<ResponseProps> {
    return await startSpan(
      { name: "ProjectRepository > deleteProject" },
      async () => {
        try {
          await prisma.project.delete({
            where: { id },
          });

          return { success: true, message: "Project deleted successfully" };
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }
}
