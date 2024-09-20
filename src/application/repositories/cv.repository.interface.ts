import type { PartialCvProps } from "@src/entities/models/cv";
import type { ResponseProps } from "types/global";

export interface ICVRepository {
  getCvs(): Promise<PartialCvProps[] | undefined>;
  createCv(
    userId: string,
    requestBody: PartialCvProps,
  ): Promise<ResponseProps | undefined>;
}
