import { ContainerModule, type interfaces } from "inversify";
import { SimpleContainer } from "../container";
import { DI_SYMBOLS } from "../types";
import type { IWikiRepository } from "@src/application/repositories/wiki.repository.interface";
import { MockWikiRepository } from "@src/infrastructure/repositories/wiki.repository.mock";
import { WikiRepository } from "@src/infrastructure/repositories/wiki.repository";

export const WikiModule = {
  init: (container: SimpleContainer) => {
    if (process.env.NODE_ENV === "test") {
      container.bind(DI_SYMBOLS.IWikiRepository, new MockWikiRepository());
    } else {
      container.bind(DI_SYMBOLS.IWikiRepository, new WikiRepository());
    }
  },
};
