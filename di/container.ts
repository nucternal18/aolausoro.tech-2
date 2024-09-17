import { Container } from "inversify";
import { startSpan } from "@sentry/nextjs";

import { type DI_RETURN_TYPES, DI_SYMBOLS } from "./types";
import { UsersModule } from "./modules/user.module";
import { ProjectsModule } from "./modules/projects.module";
import { WikiModule } from "./modules/wiki.module";
import { MessagesModule } from "./modules/messages.module";
import { JobsModule } from "./modules/jobs.module";
import { CVModule } from "./modules/cv.module";
import { IssueModule } from "./modules/issues.module";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  ApplicationContainer.load(UsersModule);
  ApplicationContainer.load(JobsModule);
  ApplicationContainer.load(CVModule);
  ApplicationContainer.load(IssueModule);
  ApplicationContainer.load(ProjectsModule);
  ApplicationContainer.load(WikiModule);
  ApplicationContainer.load(MessagesModule);
};

export const destroyContainer = () => {
  ApplicationContainer.unload(UsersModule);
  ApplicationContainer.unload(JobsModule);
  ApplicationContainer.unload(CVModule);
  ApplicationContainer.unload(IssueModule);
  ApplicationContainer.unload(ProjectsModule);
  ApplicationContainer.unload(WikiModule);
  ApplicationContainer.unload(MessagesModule);
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
