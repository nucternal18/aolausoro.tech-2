import { UsersRepository } from "@src/infrastructure/repositories/user.repository";
import { SimpleContainer } from "../container";
import { DI_SYMBOLS } from "../types";
import { MockUsersRepository } from "@src/infrastructure/repositories/user.repository.mock";

export const UsersModule = {
  init: (container: SimpleContainer) => {
    if (process.env.NODE_ENV === "test") {
      container.bind(DI_SYMBOLS.IUsersRepository, new MockUsersRepository());
    } else {
      container.bind(DI_SYMBOLS.IUsersRepository, new UsersRepository());
    }
  },
};
