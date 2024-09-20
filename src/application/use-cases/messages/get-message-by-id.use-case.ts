import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialMessageProps } from "@src/entities/models/Message";

export function getMessageByIdUseCase(
  messageId: string,
): Promise<PartialMessageProps> {
  return startSpan(
    { name: "getMessageById UseCase", op: "function" },
    async (span) => {
      const messageRepository = getInjection("IMessageRepository");
      return (await messageRepository.getMessageById(
        messageId,
      )) as PartialMessageProps;
    },
  );
}
