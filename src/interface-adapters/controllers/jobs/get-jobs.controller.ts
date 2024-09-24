import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { JobsProps } from "@src/entities/models/Job";
import { getJobsUseCase } from "@src/application/use-cases/jobs/get-jobs.use-case";
import { getInjection } from "@di/container";

function presenter(jobs: JobsProps) {
  return startSpan({ name: "getJobs Presenter", op: "serialize" }, () => {
    return jobs;
  });
}

type QueryObjProps = {
  [k: string]: string;
};

export async function getJobsController(
  queryItems: QueryObjProps,
  sessionId: string,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getJobs Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get jobs");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to get jobs");
      }

      const jobs = await getJobsUseCase(queryItems, user!.id);

      return presenter(jobs);
    },
  );
}
