import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialJobProps } from "@src/entities/models/Job";
import type { ResponseProps } from "types/global";

export function getJobByIdUseCase(
  id: string,
): Promise<PartialJobProps | undefined> {
  return startSpan(
    { name: "getJobById UseCase", op: "function" },
    async (span) => {
      const jobsRepository = getInjection("IJobsRepository");

      return (await jobsRepository.getJobById(id)) as PartialJobProps;
    },
  );
}
