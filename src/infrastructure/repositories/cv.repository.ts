import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialCvProps } from "@src/entities/models/cv";
import type { ICVRepository } from "@src/application/repositories/cv.repository.interface";

export class CVRepository implements ICVRepository {
  constructor() {}
  async getCvs(): Promise<PartialCvProps[]> {
    return await startSpan({ name: "CVRepository -> getCVs" }, async () => {
      try {
        const cvs = await prisma.cV.findMany({
          select: {
            id: true,
            cvUrl: true,
            createdAt: true,
          },
        });
        return cvs;
      } catch (error) {
        captureException(error);
        throw PrismaErrorHandler.handle(error);
      }
    });
  }

  async createCv(
    userId: string,
    input: PartialCvProps,
  ): Promise<ResponseProps> {
    return await startSpan({ name: "CVRepository -> createCV" }, async () => {
      try {
        await prisma.cV.create({
          data: {
            cvUrl: input.cvUrl as string,
            userId,
          },
        });
        return { success: true, message: "CV created successfully" };
      } catch (error) {
        captureException(error);
        throw PrismaErrorHandler.handle(error);
      }
    });
  }
}
