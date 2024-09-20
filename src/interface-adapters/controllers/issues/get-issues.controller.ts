import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import { type PartialIssueProps } from "@src/entities/models/Issue";
import { getIssuesUseCase } from "@src/application/use-cases/issues/get-issues.use-case";

function presenter(issues: PartialIssueProps[]) {
  return startSpan({ name: "getIssues Presenter", op: "serialize" }, () => {
    return issues.map((issue) => ({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      createdAt: issue.createdAt,
    }));
  });
}

export async function getIssuesController(
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getIssues Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get issues");
      }

      const issues = await getIssuesUseCase();

      return presenter(issues);
    },
  );
}
