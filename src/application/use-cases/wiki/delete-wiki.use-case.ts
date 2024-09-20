import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialWikiProps } from "@src/entities/models/Wiki";
import type { ResponseProps } from "types/global";

export function deleteWikiUseCase(wikiId: string): Promise<ResponseProps> {
  return startSpan(
    { name: "deleteWiki UseCase", op: "function" },
    async (span) => {
      const wikiRepository = getInjection("IWikiRepository");
      return await wikiRepository.deleteWiki(wikiId);
    },
  );
}
