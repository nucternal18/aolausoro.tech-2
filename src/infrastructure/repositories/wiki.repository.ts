import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialWikiProps } from "@src/entities/models/Wiki";
import type { IWikiRepository } from "@src/application/repositories/wiki.repository.interface";

// @injectable()
export class WikiRepository implements IWikiRepository {
  constructor() {}
  async getWiki(): Promise<PartialWikiProps[] | undefined> {
    return await startSpan({ name: "WikiRepository > getWiki" }, async () => {
      try {
        const wiki = prisma.wiki.findMany({
          orderBy: { createdAt: "desc" },
        });

        return wiki as Promise<PartialWikiProps[] | undefined>;
      } catch (err) {
        captureException(err);
        throw PrismaErrorHandler.handle(err);
      }
    });
  }

  async getWikiById(id: string): Promise<PartialWikiProps | undefined> {
    return await startSpan(
      { name: "WikiRepository > getWikiById" },
      async () => {
        try {
          const wiki = prisma.wiki.findUnique({
            where: { id },
          });

          return wiki as Promise<PartialWikiProps | undefined>;
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async createWiki(input: PartialWikiProps): Promise<ResponseProps> {
    return await startSpan(
      { name: "WikiRepository > createWiki" },
      async () => {
        try {
          await prisma.wiki.create({
            data: {
              title: input.title as string,
              imageUrl: input.imageUrl,
              description: input.description as string,
              isImage: input.isImage,
              user: { connect: { id: input.userId } },
            },
          });

          return { success: true, message: "Wiki created successfully" };
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async updateWiki(input: PartialWikiProps): Promise<ResponseProps> {
    return await startSpan(
      { name: "WikiRepository > updateWiki" },
      async () => {
        try {
          await prisma.wiki.update({
            where: { id: input.id },
            data: {
              title: input.title,
              imageUrl: input.imageUrl,
              description: input.description,
              isImage: input.isImage,
            },
          });

          return { success: true, message: "Wiki updated successfully" };
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async deleteWiki(id: string): Promise<ResponseProps> {
    return await startSpan(
      { name: "WikiRepository > deleteWiki" },
      async () => {
        try {
          await prisma.wiki.delete({
            where: { id },
          });

          return { success: true, message: "Wiki deleted successfully" };
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }
}
