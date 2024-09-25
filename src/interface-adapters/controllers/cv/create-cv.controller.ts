import { z } from "zod";
import { startSpan } from "@sentry/nextjs";
import { partialCvSchema, type PartialCvProps } from "@src/entities/models/cv";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";

import { createCvUseCase } from "@src/application/use-cases/cv/create-cv.use-case";
import type { ResponseProps } from "types/global";
import { getInjection } from "@di/container";

function presenter(cv: ResponseProps) {
  return startSpan({ name: "createTodo Presenter", op: "serialize" }, () => {
    return cv;
  });
}

export async function createCvController(
  input: PartialCvProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createTodo Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to create a todo");
      }
      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be logged in to create a todo");
      }

      const { data, error: inputParseError } = partialCvSchema.safeParse(input);

      if (inputParseError) {
        throw new InputParseError("Invalid data", { cause: inputParseError });
      }

      const cv = await createCvUseCase(user!.id, data);

      return presenter(cv);
    },
  );
}
