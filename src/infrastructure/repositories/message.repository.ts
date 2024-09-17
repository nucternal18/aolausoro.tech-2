import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialMessageProps } from "@src/entities/models/Message";
import type { IMessageRepository } from "@src/application/repositories/message.repository.interface";

@injectable()
export class MessageRepository implements IMessageRepository {
  async getMessages(): Promise<PartialMessageProps[] | undefined> {
    return await startSpan(
      { name: "MessageRepository > getMessages" },
      async () => {
        try {
          const messages = prisma.message.findMany({
            orderBy: { createdAt: "desc" },
          });

          return messages as Promise<PartialMessageProps[] | undefined>;
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async getMessageById(id: string): Promise<PartialMessageProps | undefined> {
    return await startSpan(
      { name: "MessageRepository > getMessageById" },
      async () => {
        try {
          const message = prisma.message.findUnique({
            where: { id },
          });

          return message as Promise<PartialMessageProps | undefined>;
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async createMessage(
    input: PartialMessageProps & { userId: string },
  ): Promise<ResponseProps> {
    return await startSpan(
      { name: "MessageRepository > createMessage" },
      async () => {
        try {
          await prisma.message.create({
            data: {
              message: input.message as string,
              email: input.email as string,
              name: input.name as string,
              subject: input.subject as string,
            },
          });

          return { success: true, message: "Message created successfully" };
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }

  async deleteMessage(id: string): Promise<ResponseProps> {
    return await startSpan(
      { name: "MessageRepository > deleteMessage" },
      async () => {
        try {
          await prisma.message.delete({
            where: { id },
          });
          return { success: true, message: "Message deleted successfully" };
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }
}
