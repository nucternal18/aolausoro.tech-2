import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IMessageRepository } from "@src/application/repositories/message.repository.interface";
import { MockMessageRepository } from "@src/infrastructure/repositories/message.repository.mock";
import { MessageRepository } from "@src/infrastructure/repositories/message.repository";
import type { SimpleContainer } from "@di/container";

export const MessagesModule = {
  init: (container: SimpleContainer) => {
    if (process.env.NODE_ENV === "test") {
      container.bind(
        DI_SYMBOLS.IMessageRepository,
        new MockMessageRepository(),
      );
    } else {
      container.bind(DI_SYMBOLS.IMessageRepository, new MessageRepository());
    }
  },
};
