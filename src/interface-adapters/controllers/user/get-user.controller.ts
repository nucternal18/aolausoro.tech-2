import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { type PartialUserProps } from "@src/entities/models/User";

import { getUserUseCase } from "@src/application/use-cases/users/get-user.use-case";
import { NotFoundError } from "@src/entities/errors/common";

function presenter(user: PartialUserProps) {
  return startSpan({ name: "getUser Presenter", op: "serialize" }, () => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  });
}

export async function getUserController(
  sessionId: string | undefined
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getUser Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get USER det");
      }

      const user = await getUserUseCase(sessionId);

        if (!user) {
          throw new NotFoundError("User not found");
        }

      return presenter(user as PartialUserProps);
    }
  );
}
