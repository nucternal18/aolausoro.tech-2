import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { ResponseProps } from "types/global";

export function deleteProjectUseCase(
  projectId: string,
): Promise<ResponseProps> {
  return startSpan(
    { name: "deleteProject UseCase", op: "function" },
    async (span) => {
      const projectRepository = getInjection("IProjectRepository");
      return await projectRepository.deleteProject(projectId);
    },
  );
}
