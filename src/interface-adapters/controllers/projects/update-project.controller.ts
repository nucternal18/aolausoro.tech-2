import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { ResponseProps } from "types/global";
import { InputParseError } from "@src/entities/errors/common";
import {
  type PartialProjectProps,
  projectSchema,
} from "@src/entities/models/Project";
import { updateProjectUseCase } from "@src/application/use-cases/projects/update-projects.use-case";
import { getInjection } from "@di/container";

function presenter(project: ResponseProps) {
  return startSpan({ name: "updateProject Presenter", op: "serialize" }, () => {
    return project;
  });
}

export async function updateProjectController(
  project: PartialProjectProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "updateProject Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to update a project");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to update a project");
      }

      const { data, error: projectParseError } =
        projectSchema.safeParse(project);

      if (projectParseError) {
        throw new InputParseError(projectParseError.message);
      }

      const updatedProject = await updateProjectUseCase(data);

      return presenter(updatedProject);
    },
  );
}
