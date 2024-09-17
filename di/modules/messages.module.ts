import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IMessageRepository } from "@src/application/repositories/message.repository.interface";
import { MockMessageRepository } from "@src/infrastructure/repositories/message.repository.mock";
import { MessageRepository } from "@src/infrastructure/repositories/message.repository";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IMessageRepository>(DI_SYMBOLS.IMessageRepository).to(
      MockMessageRepository,
    );
  } else {
    bind<IMessageRepository>(DI_SYMBOLS.IMessageRepository).to(
      MessageRepository,
    );
  }
};

export const MessagesModule = new ContainerModule(initializeModule);
