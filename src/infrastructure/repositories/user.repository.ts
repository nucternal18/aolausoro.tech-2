import { injectable } from "inversify";
import { startSpan, captureException } from "@sentry/nextjs";

import prisma from "@lib/prismadb";
import type { ResponseProps } from "types/global";
import type { IUsersRepository } from "@src/application/repositories/user.repository.interface";
import { PrismaErrorHandler } from "@src/entities/errors/common";
import type { PartialUserProps } from "@src/entities/models/User";

@injectable()
export class UsersRepository implements IUsersRepository {
  constructor() {}
  async getUser(id: string): Promise<PartialUserProps | undefined> {
    return await startSpan({ name: "UsersRepository > getUser" }, async () => {
      try {
        const user = prisma.user.findUnique({
          where: { clerkId: id },
        });

        return user as Promise<PartialUserProps | undefined>;
      } catch (err) {
        captureException(err);
        throw PrismaErrorHandler.handle(err);
      }
    });
  }
  async updateUser(
    input: PartialUserProps,
  ): Promise<ResponseProps | undefined> {
    return await startSpan(
      { name: "UsersRepository > updateUser" },
      async () => {
        try {
          await prisma.user.update({
            where: { id: input.id },
            data: {
              name: input.displayName,
              image: input.image,
              email: input.email,
            },
          });

          return { success: true, message: "User updated successfully" };
        } catch (err) {
          captureException(err);
          throw PrismaErrorHandler.handle(err);
        }
      },
    );
  }
}
