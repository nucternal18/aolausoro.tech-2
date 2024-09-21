import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";
import type { ResponseProps } from "types/global";
import { checkUserExistsUseCase } from "@src/application/use-cases/auth/check-user-exists.use-case";
import type { UserProps } from "@src/entities/models/User";

function presenter(user: UserProps) {
  return startSpan(
    { name: "checkUserExists Presenter", op: "serialize" },
    () => {
      return user;
    },
  );
}

export async function checkUserExistController(
  clerkId: string,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "checkUserExist Controller",
    },
    async () => {
      if (!clerkId) {
        throw new UnauthenticatedError("Unauthenticated");
      }

      const user = await checkUserExistsUseCase(clerkId);

      return presenter(user);
    },
  );
}
