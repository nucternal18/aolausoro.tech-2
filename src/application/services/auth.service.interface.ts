import type { UserProps } from "@src/entities/models/User";
import type { ResponseProps } from "types/global";

export interface IAuthService {
  checkIfUserExists(clerkId: string): Promise<UserProps | undefined>;
}
