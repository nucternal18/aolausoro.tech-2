import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialProjectProps } from "@src/entities/models/Project";

export function getProjectsUseCase(): Promise<PartialProjectProps[]> {
  return startSpan(
    { name: "getProjects UseCase", op: "function" },
    async (span) => {
      const projectRepository = getInjection("IProjectRepository");
      return (await projectRepository.getProjects()) as PartialProjectProps[];
    },
  );
}
