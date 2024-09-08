import type { IUsersRepository } from "@src/application/repositories/user.repository.interface";

export const DI_SYMBOLS = {
  // Services
  //   IAuthenticationService: Symbol.for("IAuthenticationService"),

  // Repositories
  IUsersRepository: Symbol.for("IUsersRepository"),
};

export interface DI_RETURN_TYPES {
  // Services
  //   IAuthenticationService: IAuthenticationService;

  // Repositories
  IUsersRepository: IUsersRepository;
}
