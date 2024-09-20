import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialJobProps } from "@src/entities/models/Job";

export function getJobsUseCase(): Promise<PartialJobProps[]> {
  return startSpan(
    { name: "getJobs UseCase", op: "function" },
    async (span) => {
      const jobsRepository = getInjection("IJobsRepository");

      return (await jobsRepository.getJobs()) as PartialJobProps[];
    },
  );
}
