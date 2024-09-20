import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialWikiProps } from "@src/entities/models/Wiki";
import type { ResponseProps } from "types/global";

export function getWikiByIdUseCase(wikiId: string): Promise<PartialWikiProps> {
  return startSpan(
    { name: "getWikiById UseCase", op: "function" },
    async (span) => {
      const wikiRepository = getInjection("IWikiRepository");
      return (await wikiRepository.getWikiById(wikiId)) as PartialWikiProps;
    },
  );
}
