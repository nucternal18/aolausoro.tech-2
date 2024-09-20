import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialIssueProps } from "@src/entities/models/Issue";

export function getIssueByIdUseCase(id: string): Promise<PartialIssueProps> {
  return startSpan(
    { name: "getIssueById UseCase", op: "function" },
    async (span) => {
      const issuesRepository = getInjection("IIssuesRepository");

      return (await issuesRepository.getIssueById(id)) as PartialIssueProps;
    },
  );
}
