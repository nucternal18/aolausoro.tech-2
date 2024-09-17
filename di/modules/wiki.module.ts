import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IWikiRepository } from "@src/application/repositories/wiki.repository.interface";
import { MockWikiRepository } from "@src/infrastructure/repositories/wiki.repository.mock";
import { WikiRepository } from "@src/infrastructure/repositories/wiki.repository";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IWikiRepository>(DI_SYMBOLS.IWikiRepository).to(MockWikiRepository);
  } else {
    bind<IWikiRepository>(DI_SYMBOLS.IWikiRepository).to(WikiRepository);
  }
};

export const WikiModule = new ContainerModule(initializeModule);
