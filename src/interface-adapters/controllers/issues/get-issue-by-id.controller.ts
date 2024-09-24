import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import { type PartialIssueProps } from "@src/entities/models/Issue";
import { getIssueByIdUseCase } from "@src/application/use-cases/issues/get-issue-by-id.use-case";
import { getInjection } from "@di/container";

function presenter(issue: PartialIssueProps) {
  return startSpan({ name: "getIssueById Presenter", op: "serialize" }, () => {
    return issue;
  });
}

export async function getIssueByIdController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getIssueById Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get issue by id");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to get issue by id");
      }

      const issue = await getIssueByIdUseCase(id);

      return presenter(issue);
    },
  );
}
