import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import {
  partialUserSchema,
  type PartialUserProps,
} from "@src/entities/models/User";

import { InputParseError } from "@src/entities/errors/common";
import { updateUserUseCase } from "@src/application/use-cases/users/update-user.use-case";
import type { ResponseProps } from "types/global";
import { getInjection } from "@di/container";

function presenter(response: ResponseProps) {
  return startSpan({ name: "updateUser Presenter", op: "serialize" }, () => {
    return {
      success: response.success,
      message: response.message,
    };
  });
}

export async function updateUserController(
  input: PartialUserProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getUser Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get USER det");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to get a user");
      }

      const { data, error: inputParseError } =
        partialUserSchema.safeParse(input);

      if (inputParseError) {
        throw new InputParseError("Invalid data", { cause: inputParseError });
      }

      const updatedUser = await updateUserUseCase(input);

      return presenter(updatedUser as ResponseProps);
    },
  );
}
