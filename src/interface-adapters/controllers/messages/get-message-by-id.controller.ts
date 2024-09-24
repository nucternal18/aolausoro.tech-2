import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { type PartialMessageProps } from "@src/entities/models/Message";
import { getMessageByIdUseCase } from "@src/application/use-cases/messages/get-message-by-id.use-case";
import { getInjection } from "@di/container";

function presenter(message: PartialMessageProps) {
  return startSpan(
    { name: "getMessageById Presenter", op: "serialize" },
    () => {
      return message;
    },
  );
}

export async function getMessageByIdController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getMessageById Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get a message");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to get a message");
      }

      const message = await getMessageByIdUseCase(id);

      return presenter(message);
    },
  );
}
