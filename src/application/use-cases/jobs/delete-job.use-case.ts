import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { ResponseProps } from "types/global";

export function deleteJobUseCase(id: string): Promise<ResponseProps> {
  return startSpan(
    { name: "deleteJob UseCase", op: "function" },
    async (span) => {
      const jobsRepository = getInjection("IJobsRepository");

      return await jobsRepository.deleteJob(id);
    },
  );
}
