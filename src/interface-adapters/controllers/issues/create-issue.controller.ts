import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";
import type { ResponseProps } from "types/global";
import {
  issueSchema,
  type PartialIssueProps,
} from "@src/entities/models/Issue";
import { createIssueUseCase } from "@src/application/use-cases/issues/create-issue.use-case";
import { getInjection } from "@di/container";

function presenter(issue: ResponseProps) {
  return startSpan({ name: "createIssue Presenter", op: "serialize" }, () => {
    return issue;
  });
}

export async function createIssueController(
  input: PartialIssueProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createIssue Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to create an issue");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to create an issue");
      }

      const { data, error: inputParseError } = issueSchema.safeParse(input);

      if (inputParseError) {
        throw new InputParseError("Invalid data", { cause: inputParseError });
      }

      const issue = await createIssueUseCase(sessionId, data);

      return presenter(issue);
    },
  );
}
