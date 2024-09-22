import type { ResponseProps } from "types/global";
import { injectable } from "inversify";
import type { IIssuesRepository } from "@src/application/repositories/issue.repository.interface";
import type {
  IssueProps,
  PartialIssueProps,
  Status,
} from "@src/entities/models/Issue";

export class MockIssueRepository implements IIssuesRepository {
  private _issues: PartialIssueProps[];

  constructor() {
    this._issues = [
      {
        id: "1",
        title: "one",
        description: "one",
        status: "OPEN" as Status,
      },
      {
        id: "2",
        title: "two",
        description: "two",
        status: "OPEN" as Status,
      },
      {
        id: "3",
        title: "three",
        description: "three",
        status: "OPEN" as Status,
      },
    ];
  }

  async getIssueById(id: string): Promise<PartialIssueProps | undefined> {
    const issue = this._issues.find((i) => i.id === id);
    return issue;
  }

  async getIssues(): Promise<PartialIssueProps[]> {
    return this._issues;
  }

  async createIssue(
    userId: string,
    input: PartialIssueProps,
  ): Promise<ResponseProps> {
    this._issues.push(input);
    return { success: true, message: "Issue created successfully" };
  }

  async updateIssue(input: PartialIssueProps): Promise<ResponseProps> {
    const issueIndex = this._issues.findIndex((i) => i.id === input.id);

    if (issueIndex === -1) {
      return { success: false, message: "Issue not found" };
    }

    this._issues[issueIndex] = input;
    return { success: true, message: "Issue updated successfully" };
  }

  async deleteIssue(id: string): Promise<ResponseProps> {
    const issueIndex = this._issues.findIndex((i) => i.id === id);

    if (issueIndex === -1) {
      return { success: false, message: "Issue not found" };
    }

    this._issues.splice(issueIndex, 1);
    return { success: true, message: "Issue deleted successfully" };
  }
}
