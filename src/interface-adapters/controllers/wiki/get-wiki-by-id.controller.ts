import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { type PartialWikiProps } from "@src/entities/models/Wiki";
import { getWikiByIdUseCase } from "@src/application/use-cases/wiki/get-wiki-by-id.use-case";
import { getInjection } from "@di/container";

function presenter(wiki: PartialWikiProps) {
  return startSpan({ name: "getWikiById Presenter", op: "serialize" }, () => {
    return wiki;
  });
}

export async function getWikiByIdController(
  id: string,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getWikiById Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get a wiki");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to get a wiki");
      }

      const wiki = await getWikiByIdUseCase(id);

      return presenter(wiki);
    },
  );
}
