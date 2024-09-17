import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { ICVRepository } from "@src/application/repositories/cv.repository.interface";
import { MockCVRepository } from "@src/infrastructure/repositories/cv.repository.mock";
import { CVRepository } from "@src/infrastructure/repositories/cv.repository";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ICVRepository>(DI_SYMBOLS.ICVRepository).to(MockCVRepository);
  } else {
    bind<ICVRepository>(DI_SYMBOLS.ICVRepository).to(CVRepository);
  }
};

export const CVModule = new ContainerModule(initializeModule);
