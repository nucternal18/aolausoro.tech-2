import type { IUsersRepository } from "@src/application/repositories/user.repository.interface";
import type { PartialUserProps } from "@src/entities/models/User";
import type { ResponseProps } from "types/global";
import { injectable } from "inversify";

@injectable()
export class MockUsersRepository implements IUsersRepository {
  private _users: PartialUserProps[];

  constructor() {
    this._users = [
      {
        id: "1",
        name: "one",
      },
      {
        id: "2",
        name: "two",
      },
      {
        id: "3",
        name: "three",
      },
    ];
  }

  async getUser(id: string): Promise<PartialUserProps | undefined> {
    const user = this._users.find((u) => u.id === id);
    return user;
  }

  async updateUser(input: PartialUserProps): Promise<ResponseProps> {
    this._users.push(input);
    return { success: true, message: "User updated successfully" };
  }
}
