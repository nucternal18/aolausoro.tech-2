import type { PartialJobProps } from "@src/entities/models/Job";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface IJobsRepository {
  //   getUser(id: string): Promise<PartialUserProps | undefined>;
  //   updateUser(requestBody: PartialUserProps): Promise<ResponseProps | undefined>;
}
