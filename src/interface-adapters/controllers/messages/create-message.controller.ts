import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { ResponseProps } from "types/global";
import {
  type PartialMessageProps,
  messageSchema,
} from "@src/entities/models/Message";
import {
  HumanValidationFailedError,
  InputParseError,
} from "@src/entities/errors/common";
import { createMessageUseCase } from "@src/application/use-cases/messages/create-message.use-case";
import { getInjection } from "@di/container";
import validateHuman from "@lib/validateHuman";

function presenter(message: ResponseProps) {
  return startSpan({ name: "createMessage Presenter", op: "serialize" }, () => {
    return message;
  });
}

export async function createMessageController(
  msg: PartialMessageProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createMessage Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to create a message");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to create a message");
      }

      const { data, error: messageParseError } = messageSchema.safeParse(msg);

      const response = await validateHuman(data!.token as string);

      if (!response) {
        throw new HumanValidationFailedError("Unable to validate human");
      }

      if (messageParseError) {
        throw new InputParseError(messageParseError.message);
      }

      const message = await createMessageUseCase(data);

      return presenter(message);
    },
  );
}
