import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialJobProps } from "@src/entities/models/Job";
import type { ResponseProps } from "types/global";

export function createJobUseCase(
  userId: string,
  input: PartialJobProps,
): Promise<ResponseProps> {
  return startSpan(
    { name: "createJob UseCase", op: "function" },
    async (span) => {
      const jobsRepository = getInjection("IJobsRepository");

      return await jobsRepository.createJob(userId, input);
    },
  );
}
