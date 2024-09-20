import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import type { ResponseProps } from "types/global";
import { deleteJobUseCase } from "@src/application/use-cases/jobs/delete-job.use-case";

function presenter(job: ResponseProps) {
  return startSpan({ name: "deleteJob Presenter", op: "serialize" }, () => {
    return job;
  });
}

export async function deleteJobController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "deleteJob Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to delete a job");
      }

      const job = await deleteJobUseCase(id);

      return presenter(job);
    },
  );
}
