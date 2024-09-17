import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IIssuesRepository } from "@src/application/repositories/issue.repository.interface";
import { MockIssueRepository } from "@src/infrastructure/repositories/issue.repository.mock";
import { IssueRepository } from "@src/infrastructure/repositories/issue.repository";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IIssuesRepository>(DI_SYMBOLS.IIssuesRepository).to(
      MockIssueRepository,
    );
  } else {
    bind<IIssuesRepository>(DI_SYMBOLS.IIssuesRepository).to(IssueRepository);
  }
};

export const IssueModule = new ContainerModule(initializeModule);
