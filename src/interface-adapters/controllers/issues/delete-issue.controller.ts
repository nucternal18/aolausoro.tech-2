import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";

import { updateIssueUseCase } from "@src/application/use-cases/issues/update-issue.use-case";
import type { ResponseProps } from "types/global";
import {
  issueSchema,
  type PartialIssueProps,
} from "@src/entities/models/Issue";
import { deleteIssueUseCase } from "@src/application/use-cases/issues/delete-issue.use-case";

function presenter(issue: ResponseProps) {
  return startSpan({ name: "deleteIssue Presenter", op: "serialize" }, () => {
    return issue;
  });
}

export async function deleteIssueController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "deleteIssue Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to delete an issue");
      }

      const issue = await deleteIssueUseCase(id);

      return presenter(issue);
    },
  );
}
