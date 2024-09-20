import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { ResponseProps } from "types/global";
import type { PartialIssueProps } from "@src/entities/models/Issue";

export function getIssuesUseCase(): Promise<PartialIssueProps[]> {
  return startSpan(
    { name: "getIssues UseCase", op: "function" },
    async (span) => {
      const issuesRepository = getInjection("IIssuesRepository");

      return (await issuesRepository.getIssues()) as PartialIssueProps[];
    },
  );
}
