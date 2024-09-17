import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import type { IProjectRepository } from "@src/application/repositories/project.repository.interface";
import { MockProjectsRepository } from "@src/infrastructure/repositories/project.repository.mock";
import { ProjectRepository } from "@src/infrastructure/repositories/project.repository";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IProjectRepository>(DI_SYMBOLS.IProjectRepository).to(
      MockProjectsRepository,
    );
  } else {
    bind<IProjectRepository>(DI_SYMBOLS.IProjectRepository).to(
      ProjectRepository,
    );
  }
};

export const ProjectsModule = new ContainerModule(initializeModule);
