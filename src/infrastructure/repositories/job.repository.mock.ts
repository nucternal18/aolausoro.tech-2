import type { ResponseProps } from "types/global";
import { injectable } from "inversify";
import type { IJobsRepository } from "@src/application/repositories/job.repository.interface";
import type {
  JobsProps,
  PartialJobProps,
  StatsProps,
} from "@src/entities/models/Job";

type QueryObjProps = {
  [k: string]: string;
};

export class MockJobRepository implements IJobsRepository {
  private _jobs: PartialJobProps[];

  constructor() {
    this._jobs = [
      {
        id: "1",
        company: "one",
        jobLocation: "one",
        jobType: "one",
        position: "one",
      },
      {
        id: "2",
        company: "two",
        jobLocation: "two",
        jobType: "two",
        position: "two",
      },
      {
        id: "3",
        company: "three",
        jobLocation: "three",
        jobType: "three",
        position: "three",
      },
    ];
  }

  getStats(id: string): Promise<StatsProps | undefined> {
    throw new Error("Method not implemented.");
  }

  async getJobById(id: string): Promise<PartialJobProps | undefined> {
    const job = this._jobs.find((u) => u.id === id);
    return job;
  }

  async updateJob(input: PartialJobProps): Promise<ResponseProps> {
    this._jobs.push(input);
    return { success: true, message: "Job updated successfully" };
  }

  async getJobs(queryItems: QueryObjProps, userId: string): Promise<JobsProps> {
    const jobs = this._jobs.filter((job) => job.createdBy === userId);
    const totalJobs = jobs.length;
    const numberOfPages = Math.ceil(totalJobs / 10);
    return { jobs, totalJobs, numberOfPages } as JobsProps;
  }

  async createJob(
    userId: string,
    input: PartialJobProps,
  ): Promise<ResponseProps> {
    this._jobs.push(input);
    return { success: true, message: "Job created successfully" };
  }

  async deleteJob(id: string): Promise<ResponseProps> {
    this._jobs = this._jobs.filter((job) => job.id !== id);
    return { success: true, message: "Job deleted successfully" };
  }
}
