import type { PartialProjectProps } from "@src/entities/models/Project";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface IProjectRepository {
  getProjects(): Promise<PartialProjectProps[] | undefined>;
  getProjectById(id: string): Promise<PartialProjectProps | undefined>;
  createProject(input: PartialProjectProps): Promise<ResponseProps>;
  updateProject(input: PartialProjectProps): Promise<ResponseProps>;
  deleteProject(id: string): Promise<ResponseProps>;
}
