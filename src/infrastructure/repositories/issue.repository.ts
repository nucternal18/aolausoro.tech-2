import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialIssueProps } from "@src/entities/models/Issue";
import type { IIssuesRepository } from "@src/application/repositories/issue.repository.interface";

@injectable()
export class IssueRepository implements IIssuesRepository {}
