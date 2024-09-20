import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialJobProps } from "@src/entities/models/Job";
import type { ResponseProps } from "types/global";

export function updateJobUseCase(
  input: PartialJobProps,
): Promise<ResponseProps> {
  return startSpan(
    { name: "updateJob UseCase", op: "function" },
    async (span) => {
      const jobsRepository = getInjection("IJobsRepository");

      return await jobsRepository.updateJob(input);
    },
  );
}
