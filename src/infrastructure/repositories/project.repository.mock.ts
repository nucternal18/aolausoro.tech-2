import type { IUsersRepository } from "@src/application/repositories/user.repository.interface";

import type { ResponseProps } from "types/global";
import { injectable } from "inversify";
import type { IProjectRepository } from "@src/application/repositories/project.repository.interface";
import type { PartialProjectProps } from "@src/entities/models/Project";

// @injectable()
export class MockProjectsRepository implements IProjectRepository {
  private _projects: PartialProjectProps[];

  constructor() {
    this._projects = [
      {
        id: "1",
        projectName: "one",
        description: "description one",
      },
      {
        id: "2",
        projectName: "two",
        description: "description two",
      },
      {
        id: "3",
        projectName: "three",
        description: "description three",
      },
    ];
  }

  async getProjects(): Promise<PartialProjectProps[] | undefined> {
    return this._projects;
  }

  async getProjectById(id: string): Promise<PartialProjectProps | undefined> {
    const project = this._projects.find((u) => u.id === id);
    return project;
  }

  async createProject(input: PartialProjectProps): Promise<ResponseProps> {
    this._projects.push(input);
    return { success: true, message: "Project created successfully" };
  }

  async updateProject(input: PartialProjectProps): Promise<ResponseProps> {
    const index = this._projects.findIndex((u) => u.id === input.id);
    this._projects[index] = input;
    return { success: true, message: "Project updated successfully" };
  }

  async deleteProject(id: string): Promise<ResponseProps> {
    const index = this._projects.findIndex((u) => u.id === id);
    this._projects.splice(index, 1);
    return { success: true, message: "Project deleted successfully" };
  }
}
