import { DI_SYMBOLS } from "../types";
import type { IIssuesRepository } from "@src/application/repositories/issue.repository.interface";
import { MockIssueRepository } from "@src/infrastructure/repositories/issue.repository.mock";
import { IssueRepository } from "@src/infrastructure/repositories/issue.repository";
import type { SimpleContainer } from "@di/container";

export const IssueModule = {
  init: (container: SimpleContainer) => {
    if (process.env.NODE_ENV === "test") {
      container.bind(DI_SYMBOLS.IIssuesRepository, new MockIssueRepository());
    } else {
      container.bind(DI_SYMBOLS.IIssuesRepository, new IssueRepository());
    }
  },
};
