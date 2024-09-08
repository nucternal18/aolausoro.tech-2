import { Container } from "inversify";
import { startSpan } from "@sentry/nextjs";

import { type DI_RETURN_TYPES, DI_SYMBOLS } from "./types";
import { UsersModule } from "./modules.ts/user.module";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  ApplicationContainer.load(UsersModule);
};

export const destroyContainer = () => {
  ApplicationContainer.unload(UsersModule);
};

if (process.env.NODE_ENV !== "test") {
  initializeContainer();
}

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K,
): DI_RETURN_TYPES[K] {
  return startSpan(
    {
      name: "(di) getInjection",
      op: "function",
      attributes: { symbol: symbol.toString() },
    },
    () => ApplicationContainer.get(DI_SYMBOLS[symbol]),
  );
}

export { ApplicationContainer };
