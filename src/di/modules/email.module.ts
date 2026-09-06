import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IEmailService } from "@src/application/services/email.service.interface";
import { MockEmailService } from "@src/infrastructure/services/email.service.mock";
import { EmailService } from "@src/infrastructure/services/email.service";
import type { SimpleContainer } from "@di/container";

export const EmailModule = {
  init: (container: SimpleContainer) => {
    if (process.env.NODE_ENV === "test") {
      container.bind(DI_SYMBOLS.IEmailService, new MockEmailService());
    } else {
      container.bind(DI_SYMBOLS.IEmailService, new EmailService());
    }
  },
};
