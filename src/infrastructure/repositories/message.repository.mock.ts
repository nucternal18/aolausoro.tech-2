import type { ResponseProps } from "types/global";
import { injectable } from "inversify";
import type { IMessageRepository } from "@src/application/repositories/message.repository.interface";
import type { PartialMessageProps } from "@src/entities/models/Message";

// @injectable()
export class MockMessageRepository implements IMessageRepository {
  private _messages: PartialMessageProps[];

  constructor() {
    this._messages = [
      {
        id: "1",
        message: "Hello",
        email: " [email protected]",
        name: "John Doe",
        subject: "Hello",
      },
      {
        id: "2",
        message: "Hello",
        email: " [email protected]",
        name: "Jane Doe",
        subject: "Hello",
      },
      {
        id: "3",
        message: "Hello",
        email: " [email protected]",
        name: "John Smith",
        subject: "Hello",
      },
    ];
  }

  async getMessageById(id: string): Promise<PartialMessageProps | undefined> {
    const message = this._messages.find((u) => u.id === id);
    return message;
  }

  async createMessage(input: PartialMessageProps): Promise<ResponseProps> {
    this._messages.push(input);
    return { success: true, message: "Message created successfully" };
  }

  async getMessages(): Promise<PartialMessageProps[] | undefined> {
    return this._messages;
  }

  async deleteMessage(id: string): Promise<ResponseProps> {
    this._messages = this._messages.filter((message) => message.id !== id);
    return { success: true, message: "Message deleted successfully" };
  }
}
