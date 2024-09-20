import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { ResponseProps } from "types/global";

export function deleteIssueUseCase(id: string): Promise<ResponseProps> {
  return startSpan(
    { name: "deleteIssue UseCase", op: "function" },
    async (span) => {
      const issuesRepository = getInjection("IIssuesRepository");

      return await issuesRepository.deleteIssue(id);
    },
  );
}
