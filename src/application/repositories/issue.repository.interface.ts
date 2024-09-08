import type { PartialIssueProps } from "@src/entities/models/Issue";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface IIssuesRepository {
  //   getUser(id: string): Promise<PartialUserProps | undefined>;
  //   updateUser(requestBody: PartialUserProps): Promise<ResponseProps | undefined>;
}
