import type { UserProps } from "@src/entities/models/User";

export interface IAuthService {
  checkIfUserExists(clerkId: string): Promise<UserProps | undefined>;
}
