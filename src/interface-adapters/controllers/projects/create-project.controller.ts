import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { ResponseProps } from "types/global";
import { InputParseError } from "@src/entities/errors/common";
import {
  type PartialProjectProps,
  projectSchema,
} from "@src/entities/models/Project";
import { createProjectUseCase } from "@src/application/use-cases/projects/create-project.use-case";
import { getInjection } from "@di/container";

function presenter(project: ResponseProps) {
  return startSpan({ name: "createProject Presenter", op: "serialize" }, () => {
    return project;
  });
}

export async function createProjectController(
  project: PartialProjectProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createProject Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to create a project");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to create a project");
      }

      const { data, error: projectParseError } =
        projectSchema.safeParse(project);

      if (projectParseError) {
        throw new InputParseError(projectParseError.message);
      }

      const createdProject = await createProjectUseCase(data);

      return presenter(createdProject);
    },
  );
}
