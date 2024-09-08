import type { PartialCvProps } from "@src/entities/models/cv";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface ICVRepository {
  //   getUser(id: string): Promise<PartialUserProps | undefined>;
  //   updateUser(requestBody: PartialUserProps): Promise<ResponseProps | undefined>;
}
