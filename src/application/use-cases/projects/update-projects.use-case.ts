import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialProjectProps } from "@src/entities/models/Project";
import type { ResponseProps } from "types/global";

export function updateProjectUseCase(
  project: PartialProjectProps,
): Promise<ResponseProps> {
  return startSpan(
    { name: "updateProject UseCase", op: "function" },
    async (span) => {
      const projectRepository = getInjection("IProjectRepository");
      return await projectRepository.updateProject(project);
    },
  );
}
