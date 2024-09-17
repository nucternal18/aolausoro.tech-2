import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import { UsersRepository } from "@src/infrastructure/repositories/user.repository";
import { MockUsersRepository } from "@src/infrastructure/repositories/user.repository.mock";
import type { IUsersRepository } from "@src/application/repositories/user.repository.interface";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(MockUsersRepository);
  } else {
    bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(UsersRepository);
  }
};

export const UsersModule = new ContainerModule(initializeModule);
