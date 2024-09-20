import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialWikiProps } from "@src/entities/models/Wiki";
import type { ResponseProps } from "types/global";

export function createWikiUseCase(
  wiki: PartialWikiProps,
): Promise<ResponseProps> {
  return startSpan(
    { name: "createWiki UseCase", op: "function" },
    async (span) => {
      const wikiRepository = getInjection("IWikiRepository");
      return await wikiRepository.createWiki(wiki);
    },
  );
}
