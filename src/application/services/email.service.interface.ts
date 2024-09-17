import type { PartialMessageProps } from "@src/entities/models/Message";
import type { ResponseProps } from "types/global";

export interface IEmailService {
  sendEmail(message: PartialMessageProps): Promise<ResponseProps | undefined>;
}
