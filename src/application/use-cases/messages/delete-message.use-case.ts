import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { ResponseProps } from "types/global";

export function deleteMessageUseCase(
  messageId: string,
): Promise<ResponseProps> {
  return startSpan(
    { name: "deleteMessage UseCase", op: "function" },
    async () => {
      const messageRepository = getInjection("IMessageRepository");

      return await messageRepository.deleteMessage(messageId);
    },
  );
}
