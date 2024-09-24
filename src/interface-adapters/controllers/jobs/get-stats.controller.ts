import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { StatsProps } from "@src/entities/models/Job";
import { getStatsUseCase } from "@src/application/use-cases/jobs/get-stats.use-case";
import { getInjection } from "@di/container";

function presenter(stats: StatsProps) {
  return startSpan({ name: "getStats Presenter", op: "serialize" }, () => {
    return stats;
  });
}

export async function getStatsController(
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getStats Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get stats");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to get stats");
      }

      const stats = await getStatsUseCase(sessionId);

      return presenter(stats);
    },
  );
}
