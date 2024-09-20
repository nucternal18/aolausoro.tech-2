import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { ResponseProps } from "types/global";
import type { PartialIssueProps } from "@src/entities/models/Issue";

export function createIssueUseCase(
  userId: string,
  input: PartialIssueProps,
): Promise<ResponseProps> {
  return startSpan(
    { name: "createIssue UseCase", op: "function" },
    async (span) => {
      const issuesRepository = getInjection("IIssuesRepository");

      return await issuesRepository.createIssue(userId, input);
    },
  );
}
