import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { getProjectByIdUseCase } from "@src/application/use-cases/projects/get-projects-by-id.use-case";
import { type PartialProjectProps } from "@src/entities/models/Project";
import { getInjection } from "@di/container";

function presenter(project: PartialProjectProps) {
  return startSpan(
    { name: "getProjectById Presenter", op: "serialize" },
    () => {
      return project;
    },
  );
}

export async function getProjectByIdController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getProjectById Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get a project");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to get a project");
      }

      const project = await getProjectByIdUseCase(id);

      return presenter(project);
    },
  );
}
