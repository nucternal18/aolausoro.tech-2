import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { ResponseProps } from "types/global";
import { deleteWikiUseCase } from "@src/application/use-cases/wiki/delete-wiki.use-case";
import { getInjection } from "@di/container";

function presenter(wiki: ResponseProps) {
  return startSpan({ name: "deleteWiki Presenter", op: "serialize" }, () => {
    return wiki;
  });
}

export async function deleteWikiController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "deleteWiki Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to delete a wiki");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to delete a wiki");
      }

      const wiki = await deleteWikiUseCase(id);

      return presenter(wiki);
    },
  );
}
