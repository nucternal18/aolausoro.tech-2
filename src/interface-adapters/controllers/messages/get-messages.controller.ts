import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { type PartialMessageProps } from "@src/entities/models/Message";
import { getMessagesUseCase } from "@src/application/use-cases/messages/get-messages.use-case";
import { getInjection } from "@di/container";

function presenter(messages: PartialMessageProps[]) {
  return startSpan({ name: "getMessages Presenter", op: "serialize" }, () => {
    return messages;
  });
}

export async function getMessagesController(
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getMessages Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get messages");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to get messages");
      }

      const messages = await getMessagesUseCase();

      return presenter(messages);
    },
  );
}
