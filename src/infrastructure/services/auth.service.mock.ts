import { startSpan } from "@sentry/nextjs";
import type { IAuthService } from "@src/application/services/auth.service.interface";
import type { UserProps } from "@src/entities/models/User";

export class MockAuthService implements IAuthService {
  private _user: UserProps;

  constructor() {
    this._user = {
      id: "1",
      clerkId: "1",
      email: "user@example.com",
      name: "User Name",
      displayName: "Display Name",
      image: "https://example.com/image.jpg",
      isAdmin: false,
      projects: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: new Date(),
      jobs: [],
      issues: [],
      // Add any other required properties
    };
  }

  async checkIfUserExists(clerkId: string): Promise<UserProps | undefined> {
    return startSpan(
      { name: "MockAuthService > checkIfUserExists" },
      async () => {
        if (this._user.clerkId === clerkId) {
          return this._user;
        }
        return undefined;
      },
    );
  }
}
