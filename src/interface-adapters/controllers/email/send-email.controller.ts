import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";
import type { ResponseProps } from "types/global";
import { sendEmailUseCase } from "@src/application/use-cases/email/send-email.use-case";
import {
  type PartialMessageProps,
  partialMessageSchema,
} from "@src/entities/models/Message";

function presenter(issue: ResponseProps) {
  return startSpan({ name: "createIssue Presenter", op: "serialize" }, () => {
    return issue;
  });
}

export async function sendEmailController(
  input: PartialMessageProps,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createIssue Controller",
    },
    async () => {
      const { data, error: inputParseError } =
        partialMessageSchema.safeParse(input);

      if (inputParseError) {
        throw new InputParseError("Invalid data", { cause: inputParseError });
      }

      const issue = await sendEmailUseCase(data);

      return presenter(issue);
    },
  );
}
