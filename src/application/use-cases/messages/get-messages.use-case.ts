import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialMessageProps } from "@src/entities/models/Message";

export function getMessagesUseCase(): Promise<PartialMessageProps[]> {
  return startSpan(
    { name: "getMessages UseCase", op: "function" },
    async (span) => {
      const messageRepository = getInjection("IMessageRepository");
      return (await messageRepository.getMessages()) as PartialMessageProps[];
    },
  );
}
