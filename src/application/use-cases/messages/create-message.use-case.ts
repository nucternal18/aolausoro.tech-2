import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialMessageProps } from "@src/entities/models/Message";
import type { ResponseProps } from "types/global";

export function createMessageUseCase(
  input: PartialMessageProps,
): Promise<ResponseProps> {
  return startSpan(
    { name: "createMessage UseCase", op: "function" },
    async (span) => {
      const messageRepository = getInjection("IMessageRepository");
      return await messageRepository.createMessage(input);
    },
  );
}
