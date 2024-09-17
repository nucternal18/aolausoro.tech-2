import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IJobsRepository } from "@src/application/repositories/job.repository.interface";
import { MockJobRepository } from "@src/infrastructure/repositories/job.repository.mock";
import { JobRepository } from "@src/infrastructure/repositories/job.repository";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IJobsRepository>(DI_SYMBOLS.IJobsRepository).to(MockJobRepository);
  } else {
    bind<IJobsRepository>(DI_SYMBOLS.IJobsRepository).to(JobRepository);
  }
};

export const JobsModule = new ContainerModule(initializeModule);
