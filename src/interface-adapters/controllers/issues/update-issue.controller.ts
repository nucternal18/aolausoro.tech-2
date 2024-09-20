import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";

import { updateIssueUseCase } from "@src/application/use-cases/issues/update-issue.use-case";
import type { ResponseProps } from "types/global";
import {
  issueSchema,
  type PartialIssueProps,
} from "@src/entities/models/Issue";

function presenter(cv: ResponseProps) {
  return startSpan({ name: "updateIssue Presenter", op: "serialize" }, () => {
    return cv;
  });
}

export async function updateIssueController(
  input: PartialIssueProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "updateIssue Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to create an issue");
      }

      const { data, error: inputParseError } = issueSchema.safeParse(input);

      if (inputParseError) {
        throw new InputParseError("Invalid data", { cause: inputParseError });
      }

      const issue = await updateIssueUseCase(data);

      return presenter(issue);
    },
  );
}
