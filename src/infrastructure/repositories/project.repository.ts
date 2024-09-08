import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialProjectProps } from "@src/entities/models/Project";
import type { IProjectRepository } from "@src/application/repositories/project.repository.interface";

@injectable()
export class ProjectRepository implements IProjectRepository {}
