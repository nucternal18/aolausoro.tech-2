import { startSpan } from "@sentry/nextjs";
import { getInjection } from "@di/container";

import type { PartialCvProps } from "@src/entities/models/cv";

export function getCvsUseCase(): Promise<PartialCvProps[]> {
  return startSpan({ name: "getCvs UseCase", op: "function" }, async (span) => {
    const cvRepository = getInjection("ICVRepository");

    return (await cvRepository.getCvs()) as PartialCvProps[];
  });
}
