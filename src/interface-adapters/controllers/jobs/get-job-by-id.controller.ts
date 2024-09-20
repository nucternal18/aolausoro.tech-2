import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { type PartialJobProps } from "@src/entities/models/Job";
import { getJobByIdUseCase } from "@src/application/use-cases/jobs/get-job-by-id.use-case";

function presenter(job: PartialJobProps) {
  return startSpan({ name: "updateJob Presenter", op: "serialize" }, () => {
    return job;
  });
}

export async function getJobByIdController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "updateJob Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to update a job");
      }

      const job = await getJobByIdUseCase(id);

      return presenter(job as PartialJobProps);
    },
  );
}
