import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { UserProps } from "@src/entities/models/User";

export function checkUserExistsUseCase(clerkId: string): Promise<UserProps> {
  return startSpan(
    { name: "checkUserExists UseCase", op: "function" },
    async (span) => {
      const authService = getInjection("IAuthService");

      return (await authService.checkIfUserExists(clerkId)) as UserProps;
    },
  );
}
