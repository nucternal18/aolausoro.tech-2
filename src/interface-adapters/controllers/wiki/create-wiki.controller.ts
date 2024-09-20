import { startSpan } from "@sentry/nextjs";
import { UnauthenticatedError } from "@src/entities/errors/auth";

import type { ResponseProps } from "types/global";
import { InputParseError } from "@src/entities/errors/common";
import { wikiSchema, type PartialWikiProps } from "@src/entities/models/Wiki";
import { createWikiUseCase } from "@src/application/use-cases/wiki/create-wiki.use-case";

function presenter(wiki: ResponseProps) {
  return startSpan({ name: "createWiki Presenter", op: "serialize" }, () => {
    return wiki;
  });
}

export async function createWikiController(
  input: PartialWikiProps,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createWiki Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to create a wiki");
      }

      const { data, error: parsedWikiError } = wikiSchema.safeParse(input);

      if (parsedWikiError) {
        throw new InputParseError(parsedWikiError.message);
      }

      const wiki = await createWikiUseCase(data);

      return presenter(wiki);
    },
  );
}
