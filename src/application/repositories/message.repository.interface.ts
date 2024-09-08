import type { PartialMessageProps } from "@src/entities/models/Message";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface IMessageRepository {
  //   getUser(id: string): Promise<PartialUserProps | undefined>;
  //   updateUser(requestBody: PartialUserProps): Promise<ResponseProps | undefined>;
}
