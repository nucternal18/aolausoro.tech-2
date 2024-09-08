import type { PartialProjectProps } from "@src/entities/models/Project";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface IProjectRepository {
  //   getUser(id: string): Promise<PartialUserProps | undefined>;
  //   updateUser(requestBody: PartialUserProps): Promise<ResponseProps | undefined>;
}
