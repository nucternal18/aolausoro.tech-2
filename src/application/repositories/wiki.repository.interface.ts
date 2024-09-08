import type { PartialWikiProps } from "@src/entities/models/Wiki";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface IWikiRepository {
  //   getUser(id: string): Promise<PartialUserProps | undefined>;
  //   updateUser(requestBody: PartialUserProps): Promise<ResponseProps | undefined>;
}
