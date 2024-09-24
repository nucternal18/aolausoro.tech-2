import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { ResponseProps } from "types/global";
import { jobSchema, type PartialJobProps } from "@src/entities/models/Job";
import { InputParseError } from "@src/entities/errors/common";
import { createJobUseCase } from "@src/application/use-cases/jobs/create-job.use-case";
import { getInjection } from "@di/container";

function presenter(job: ResponseProps) {
  return startSpan({ name: "createJob Presenter", op: "serialize" }, () => {
    return job;
  });
}

export async function createJobController(
  input: PartialJobProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createJob Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to create a job");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to create a job");
      }

      const { data, error: inputParseError } = jobSchema.safeParse(input);

      if (inputParseError) {
        throw new InputParseError("Invalid data", { cause: inputParseError });
      }

      const job = await createJobUseCase(sessionId, data);

      return presenter(job);
    },
  );
}
