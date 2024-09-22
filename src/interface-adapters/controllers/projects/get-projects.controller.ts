import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { type PartialProjectProps } from "@src/entities/models/Project";
import { getProjectsUseCase } from "@src/application/use-cases/projects/get-projects.use-case";

function presenter(projects: PartialProjectProps[]) {
  return startSpan({ name: "getProjects Presenter", op: "serialize" }, () => {
    return projects;
  });
}

export async function getProjectsController(): Promise<
  ReturnType<typeof presenter>
> {
  return await startSpan(
    {
      name: "getProjects Controller",
    },
    async () => {
      const projects = await getProjectsUseCase();

      return presenter(projects);
    },
  );
}
