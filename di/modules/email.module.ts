import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IEmailService } from "@src/application/services/email.service.interface";
import { MockEmailService } from "@src/infrastructure/services/email.service.mock";
import { EmailService } from "@src/infrastructure/services/email.service";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IEmailService>(DI_SYMBOLS.IEmailService).to(MockEmailService);
  } else {
    bind<IEmailService>(DI_SYMBOLS.IEmailService).to(EmailService);
  }
};

export const EmailModule = new ContainerModule(initializeModule);
