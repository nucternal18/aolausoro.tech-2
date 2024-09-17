import type { IEmailService } from "@src/application/services/email.service.interface";
import type { IMessageRepository } from "@src/application/repositories/message.repository.interface";
import type { IJobsRepository } from "@src/application/repositories/job.repository.interface";
import type { IIssuesRepository } from "@src/application/repositories/issue.repository.interface";
import type { ICVRepository } from "@src/application/repositories/cv.repository.interface";
import type { IProjectRepository } from "@src/application/repositories/project.repository.interface";
import type { IWikiRepository } from "@src/application/repositories/wiki.repository.interface";
import type { IUsersRepository } from "@src/application/repositories/user.repository.interface";

export const DI_SYMBOLS = {
  // Services
  //   IAuthenticationService: Symbol.for("IAuthenticationService"),
  IEmailService: Symbol.for("IEmailService"),

  // Repositories
  IUsersRepository: Symbol.for("IUsersRepository"),
  IWikiRepository: Symbol.for("IWikiRepository"),
  IProjectRepository: Symbol.for("IProjectRepository"),
  ICVRepository: Symbol.for("ICVRepository"),
  IIssuesRepository: Symbol.for("IIssuesRepository"),
  IJobsRepository: Symbol.for("IJobsRepository"),
  IMessageRepository: Symbol.for("IMessageRepository"),
};

export interface DI_RETURN_TYPES {
  // Services
  //   IAuthenticationService: IAuthenticationService;
  IEmailService: IEmailService;

  // Repositories
  IUsersRepository: IUsersRepository;
  IWikiRepository: IWikiRepository;
  ICVRepository: ICVRepository;
  IProjectRepository: IProjectRepository;
  IIssuesRepository: IIssuesRepository;
  IJobsRepository: IJobsRepository;
  IMessageRepository: IMessageRepository;
}
