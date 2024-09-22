import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IJobsRepository } from "@src/application/repositories/job.repository.interface";
import { MockJobRepository } from "@src/infrastructure/repositories/job.repository.mock";
import { JobRepository } from "@src/infrastructure/repositories/job.repository";
import type { SimpleContainer } from "@di/container";

export const JobsModule = {
  init: (container: SimpleContainer) => {
    if (process.env.NODE_ENV === "test") {
      container.bind(DI_SYMBOLS.IJobsRepository, new MockJobRepository());
    } else {
      container.bind(DI_SYMBOLS.IJobsRepository, new JobRepository());
    }
  },
};
