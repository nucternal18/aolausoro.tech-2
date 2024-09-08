import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialCvProps } from "@src/entities/models/cv";
import type { ICVRepository } from "@src/application/repositories/cv.repository.interface";

@injectable()
export class CVRepository implements ICVRepository {}
