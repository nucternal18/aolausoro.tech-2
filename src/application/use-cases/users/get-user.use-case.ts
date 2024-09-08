import { startSpan } from "@sentry/nextjs";
import type { PartialUserProps } from "@src/entities/models/User";
import { getInjection } from "di/container";

export function getUserUseCase(
  userId: string,
): Promise<PartialUserProps | undefined> {
  return startSpan({ name: "getUser UseCase", op: "function" }, async () => {
    const userRepository = getInjection("IUsersRepository");

    return await userRepository.getUser(userId);
  });
}
