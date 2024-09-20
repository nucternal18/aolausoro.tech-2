import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialProjectProps } from "@src/entities/models/Project";
import type { ResponseProps } from "types/global";

export function createProjectUseCase(
  project: PartialProjectProps,
): Promise<ResponseProps> {
  return startSpan(
    { name: "createProject UseCase", op: "function" },
    async (span) => {
      const projectRepository = getInjection("IProjectRepository");
      return await projectRepository.createProject(project);
    },
  );
}
