import type { PartialMessageProps } from "@src/entities/models/Message";

export type ResponseProps = {
  success: boolean;
  message: string;
};

export interface IMessageRepository {
  getMessages(): Promise<PartialMessageProps[] | undefined>;
  getMessageById(id: string): Promise<PartialMessageProps | undefined>;
  createMessage(input: PartialMessageProps): Promise<ResponseProps>;
  deleteMessage(id: string): Promise<ResponseProps>;
}
