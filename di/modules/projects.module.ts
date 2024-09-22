import { ContainerModule, type interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import { MockProjectsRepository } from "@src/infrastructure/repositories/project.repository.mock";
import { ProjectRepository } from "@src/infrastructure/repositories/project.repository";
import type { SimpleContainer } from "@di/container";

export const ProjectsModule = {
  init: (container: SimpleContainer) => {
    if (process.env.NODE_ENV === "test") {
      container.bind(
        DI_SYMBOLS.IProjectRepository,
        new MockProjectsRepository(),
      );
    } else {
      container.bind(DI_SYMBOLS.IProjectRepository, new ProjectRepository());
    }
  },
};
