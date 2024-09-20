import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialProjectProps } from "@src/entities/models/Project";

export function getProjectByIdUseCase(
  projectId: string,
): Promise<PartialProjectProps> {
  return startSpan(
    { name: "getProjectById UseCase", op: "function" },
    async (span) => {
      const projectRepository = getInjection("IProjectRepository");
      return (await projectRepository.getProjectById(
        projectId,
      )) as PartialProjectProps;
    },
  );
}
