import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialMessageProps } from "@src/entities/models/Message";
import type { IMessageRepository } from "@src/application/repositories/message.repository.interface";

@injectable()
export class MessageRepository implements IMessageRepository {}
