import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { ResponseProps } from "types/global";
import { InputParseError } from "@src/entities/errors/common";
import { updateWikiUseCase } from "@src/application/use-cases/wiki/update-wiki.use-case";
import { wikiSchema, type PartialWikiProps } from "@src/entities/models/Wiki";
import { getInjection } from "@di/container";

function presenter(wiki: ResponseProps) {
  return startSpan({ name: "updateWiki Presenter", op: "serialize" }, () => {
    return wiki;
  });
}

export async function updateWikiController(
  wiki: PartialWikiProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "updateWiki Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to update a wiki");
      }

      const authenticationService = getInjection("IAuthService");
      const user = await authenticationService.checkIfUserExists(sessionId);

      if (!user!.isAdmin) {
        throw new UnauthenticatedError("Must be an admin to update a wiki");
      }

      const { data, error: wikiParseError } = wikiSchema.safeParse(wiki);

      if (wikiParseError) {
        throw new InputParseError(wikiParseError.message);
      }

      const updatedWiki = await updateWikiUseCase(data);

      return presenter(updatedWiki);
    },
  );
}
