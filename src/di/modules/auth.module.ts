import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IAuthService } from "@src/application/services/auth.service.interface";
import { AuthService } from "@src/infrastructure/services/auth.service";
import { MockAuthService } from "@src/infrastructure/services/auth.service.mock";
import type { SimpleContainer } from "@di/container";

export const AuthModule = {
  init: (container: SimpleContainer) => {
    if (process.env.NODE_ENV === "test") {
      container.bind(DI_SYMBOLS.IAuthService, new MockAuthService());
    } else {
      container.bind(DI_SYMBOLS.IAuthService, new AuthService());
    }
  },
};
