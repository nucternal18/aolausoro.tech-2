import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { ResponseProps } from "types/global";
import {
  type PartialMessageProps,
  messageSchema,
} from "@src/entities/models/Message";
import { InputParseError } from "@src/entities/errors/common";
import { createMessageUseCase } from "@src/application/use-cases/messages/create-message.use-case";

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

      const { data, error: messageParseError } = messageSchema.safeParse(msg);

      if (messageParseError) {
        throw new InputParseError(messageParseError.message);
      }

      const message = await createMessageUseCase(data);

      return presenter(message);
    },
  );
}
