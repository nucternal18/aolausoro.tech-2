import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { ResponseProps } from "types/global";
import type { PartialMessageProps } from "@src/entities/models/Message";

export function sendEmailUseCase(
  input: PartialMessageProps,
): Promise<ResponseProps> {
  return startSpan(
    { name: "sendEmail UseCase", op: "function" },
    async (span) => {
      const emailService = getInjection("IEmailService");

      return (await emailService.sendEmail(input)) as ResponseProps;
    },
  );
}
