import type { PartialUserProps } from "@src/entities/models/User";
import type { ResponseProps } from "types/global";

export interface IUsersRepository {
  getUser(id: string): Promise<PartialUserProps | undefined>;
  updateUser(requestBody: PartialUserProps): Promise<ResponseProps | undefined>;
}
