import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { ICVRepository } from "@src/application/repositories/cv.repository.interface";
import { MockCVRepository } from "@src/infrastructure/repositories/cv.repository.mock";
import { CVRepository } from "@src/infrastructure/repositories/cv.repository";
import type { SimpleContainer } from "@di/container";

export const CVModule = {
  init: (container: SimpleContainer) => {
    if (process.env.NODE_ENV === "test") {
      container.bind(DI_SYMBOLS.ICVRepository, new MockCVRepository());
    } else {
      container.bind(DI_SYMBOLS.ICVRepository, new CVRepository());
    }
  },
};
