import type { PartialCvProps } from "@src/entities/models/cv";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface ICVRepository {
  getCvs(): Promise<PartialCvProps[] | undefined>;
  createCv(
    userId: string,
    requestBody: PartialCvProps,
  ): Promise<ResponseProps | undefined>;
}
