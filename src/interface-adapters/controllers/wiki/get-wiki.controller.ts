import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";
import { type PartialWikiProps } from "@src/entities/models/Wiki";
import { getWikiUseCase } from "@src/application/use-cases/wiki/get-wiki.use-case";

function presenter(wiki: PartialWikiProps[]) {
  return startSpan({ name: "getWiki Presenter", op: "serialize" }, () => {
    return wiki;
  });
}

export async function getWikiController(
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "getWiki Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to get a wiki");
      }

      const wiki = await getWikiUseCase();

      return presenter(wiki);
    },
  );
}
