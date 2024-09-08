import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialCvProps } from "@src/entities/models/cv";
import type { IWikiRepository } from "@src/application/repositories/wiki.repository.interface";

@injectable()
export class WikiRepository implements IWikiRepository {}
