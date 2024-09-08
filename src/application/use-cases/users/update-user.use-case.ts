import { startSpan } from "@sentry/nextjs";
import type { PartialUserProps } from "@src/entities/models/User";
import type { ResponseProps } from "types/global";
import { getInjection } from "di/container";

export function updateUserUseCase(
  input: PartialUserProps,
): Promise<ResponseProps | undefined> {
  return startSpan({ name: "getUser UseCase", op: "function" }, async () => {
    const userRepository = getInjection("IUsersRepository");

    return await userRepository.updateUser(input);
  });
}
