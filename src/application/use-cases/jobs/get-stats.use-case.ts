import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { StatsProps } from "@src/entities/models/Job";

export function getStatsUseCase(id: string): Promise<StatsProps> {
  return startSpan(
    { name: "getStats UseCase", op: "function" },
    async (span) => {
      const jobsRepository = getInjection("IJobsRepository");

      return (await jobsRepository.getStats(id)) as StatsProps;
    },
  );
}
