import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { ResponseProps } from "types/global";
import { deleteProjectUseCase } from "@src/application/use-cases/projects/delete-projects.use-case";

function presenter(project: ResponseProps) {
  return startSpan({ name: "deleteProject Presenter", op: "serialize" }, () => {
    return project;
  });
}

export async function deleteProjectController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "deleteProject Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to delete a project");
      }

      const deletedProject = await deleteProjectUseCase(id);

      return presenter(deletedProject);
    },
  );
}
