import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialWikiProps } from "@src/entities/models/Wiki";

export function getWikiUseCase(): Promise<PartialWikiProps[]> {
  return startSpan(
    { name: "getWiki UseCase", op: "function" },
    async (span) => {
      const wikiRepository = getInjection("IWikiRepository");
      return (await wikiRepository.getWiki()) as PartialWikiProps[];
    },
  );
}
