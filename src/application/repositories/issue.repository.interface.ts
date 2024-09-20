import type { PartialIssueProps } from "@src/entities/models/Issue";
import type { ResponseProps } from "types/global";

export interface IIssuesRepository {
  getIssues(): Promise<PartialIssueProps[] | undefined>;
  getIssueById(id: string): Promise<PartialIssueProps | undefined>;
  createIssue(userId: string, input: PartialIssueProps): Promise<ResponseProps>;
  updateIssue(input: PartialIssueProps): Promise<ResponseProps>;
  deleteIssue(id: string): Promise<ResponseProps>;
}
