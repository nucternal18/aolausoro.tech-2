import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import type { ResponseProps } from "types/global";
import { deleteMessageUseCase } from "@src/application/use-cases/messages/delete-message.use-case";
import { getInjection } from "@di/container";

function presenter(message: ResponseProps) {
  return startSpan({ name: "deleteMessage Presenter", op: "serialize" }, () => {
    return message;
  });
}

export async function deleteMessageController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "deleteMessage Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to delete a message");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to delete a message");
      }

      const message = await deleteMessageUseCase(id);

      return presenter(message);
    },
  );
}
