import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { PartialJobProps } from "@src/entities/models/Job";
import { getJobsUseCase } from "@src/application/use-cases/jobs/get-jobs.use-case";

function presenter(jobs: PartialJobProps[]) {
  return startSpan({ name: "getJobs Presenter", op: "serialize" }, () => {
    return jobs;
  });
}

export async function getJobsController(
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getJobs Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get jobs");
      }

      const jobs = await getJobsUseCase();

      return presenter(jobs);
    },
  );
}
