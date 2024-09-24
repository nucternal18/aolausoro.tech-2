import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { JobsProps } from "@src/entities/models/Job";

type QueryObjProps = {
  [k: string]: string;
};

export function getJobsUseCase(
  queryItems: QueryObjProps,
  userId: string,
): Promise<JobsProps> {
  return startSpan(
    { name: "getJobs UseCase", op: "function" },
    async (span) => {
      const jobsRepository = getInjection("IJobsRepository");

      return (await jobsRepository.getJobs(queryItems, userId)) as JobsProps;
    },
  );
}
