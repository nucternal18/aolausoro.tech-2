import type {
  JobsProps,
  PartialJobProps,
  StatsProps,
} from "@src/entities/models/Job";
import type { ResponseProps } from "types/global";

type QueryObjProps = {
  [k: string]: string;
};
export interface IJobsRepository {
  getStats(id: string): Promise<StatsProps | undefined>;
  getJobs(
    queryItems: QueryObjProps,
    userId: string,
  ): Promise<JobsProps | undefined>;
  getJobById(id: string): Promise<PartialJobProps | undefined>;
  createJob(userId: string, input: PartialJobProps): Promise<ResponseProps>;
  updateJob(input: PartialJobProps): Promise<ResponseProps>;
  deleteJob(id: string): Promise<ResponseProps>;
}
