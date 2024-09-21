import { inject, injectable } from "inversify";
import { captureException, startSpan } from "@sentry/nextjs";
import type { IAuthService } from "@src/application/services/auth.service.interface";
import type { UserProps } from "@src/entities/models/User";
import prisma from "@lib/prismadb";

import { PrismaErrorHandler } from "@src/entities/errors/common";

@injectable()
export class AuthService implements IAuthService {
  constructor() {}

  async checkIfUserExists(clerkId: string): Promise<UserProps | undefined> {
    return startSpan({ name: "AuthService > checkIfUserExists" }, async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { clerkId },
        });
        return user as UserProps;
      } catch (error) {
        captureException(error);
        throw PrismaErrorHandler.handle(error);
      }
    });
  }
}
