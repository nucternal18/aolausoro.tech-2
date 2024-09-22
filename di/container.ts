import { startSpan } from "@sentry/nextjs";

import { type DI_RETURN_TYPES, DI_SYMBOLS } from "./types";
import { UsersModule } from "./modules/user.module";
import { ProjectsModule } from "./modules/projects.module";
import { WikiModule } from "./modules/wiki.module";
import { MessagesModule } from "./modules/messages.module";
import { JobsModule } from "./modules/jobs.module";
import { CVModule } from "./modules/cv.module";
import { IssueModule } from "./modules/issues.module";
import { EmailModule } from "./modules/email.module";
import { AuthModule } from "./modules/auth.module";

// Custom container implementation
class SimpleContainer {
  private dependencies: Map<symbol, any> = new Map();

  bind<T>(symbol: symbol, implementation: T): void {
    this.dependencies.set(symbol, implementation);
  }

  get<T>(symbol: symbol): T {
    const dependency = this.dependencies.get(symbol);
    if (!dependency) {
      throw new Error(`Dependency not found for symbol: ${symbol.toString()}`);
    }
    return dependency;
  }

  load(module: { init: (container: SimpleContainer) => void }): void {
    module.init(this);
  }

  unload(module: { init: (container: SimpleContainer) => void }): void {
    // Implement unload logic
    // Find and remove all dependencies associated with this module
    for (const [key, value] of this.dependencies.entries()) {
      if (
        value === module ||
        (typeof value === "function" && value === module.init)
      ) {
        this.dependencies.delete(key);
      }
    }
  }
}

const ApplicationContainer = new SimpleContainer();

export const initializeContainer = () => {
  ApplicationContainer.load(UsersModule);
  ApplicationContainer.load(JobsModule);
  ApplicationContainer.load(CVModule);
  ApplicationContainer.load(IssueModule);
  ApplicationContainer.load(ProjectsModule);
  ApplicationContainer.load(WikiModule);
  ApplicationContainer.load(MessagesModule);
  ApplicationContainer.load(EmailModule);
  ApplicationContainer.load(AuthModule);
};

export const destroyContainer = () => {
  ApplicationContainer.unload(UsersModule);
  ApplicationContainer.unload(JobsModule);
  ApplicationContainer.unload(CVModule);
  ApplicationContainer.unload(IssueModule);
  ApplicationContainer.unload(ProjectsModule);
  ApplicationContainer.unload(WikiModule);
  ApplicationContainer.unload(MessagesModule);
  ApplicationContainer.unload(EmailModule);
  ApplicationContainer.unload(AuthModule);
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

export { ApplicationContainer, SimpleContainer };
