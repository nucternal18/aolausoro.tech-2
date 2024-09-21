import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IAuthService } from "@src/application/services/auth.service.interface";
import { AuthService } from "@src/infrastructure/services/auth.service";
import { MockAuthService } from "@src/infrastructure/services/auth.service.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IAuthService>(DI_SYMBOLS.IAuthService).to(MockAuthService);
  } else {
    bind<IAuthService>(DI_SYMBOLS.IAuthService).to(AuthService);
  }
};

export const AuthModule = new ContainerModule(initializeModule);
