import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialJobProps } from "@src/entities/models/Job";
import type { IJobsRepository } from "@src/application/repositories/job.repository.interface";

@injectable()
export class JobRepository implements IJobsRepository {}
