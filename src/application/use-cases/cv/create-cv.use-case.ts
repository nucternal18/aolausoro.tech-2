import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { ResponseProps } from "types/global";
import type { PartialCvProps } from "@src/entities/models/cv";

export function createCvUseCase(
  userId: string,
  requestBody: PartialCvProps,
): Promise<ResponseProps> {
  return startSpan(
    { name: "createCv UseCase", op: "function" },
    async (span) => {
      const cvRepository = getInjection("ICVRepository");

      return (await cvRepository.createCv(
        userId,
        requestBody,
      )) as ResponseProps;
    },
  );
}
