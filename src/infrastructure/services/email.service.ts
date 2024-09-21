import type { IEmailService } from "./../../application/services/email.service.interface";

import { captureException, startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import resend from "@lib/resend";
import type { ResponseProps } from "types/global";
import type { PartialMessageProps } from "@src/entities/models/Message";
import type { Resend } from "resend";

@injectable()
export class EmailService implements IEmailService {
  private _emailClient: Resend;

  constructor() {
    this._emailClient = resend;
  }

  async sendEmail(message: PartialMessageProps): Promise<ResponseProps> {
    return startSpan(
      {
        name: "EmailService.sendEmail",
        op: "function",
        attributes: {
          message: JSON.stringify(message),
        },
      },
      async () => {
        try {
          const output = `
                        <p>You have a new contact request</p>
                        <h3>Contact Details</h3>
                        <ul>
                            <li>Name: ${message.name}</li>
                            <li>Email: ${message.email}</li>
                            <li>Subject: ${message.subject}</li>
                        </ul>
                        <h3>Message</h3>
                        <p>${message}</p>
                    `;

          const { data, error } = await this._emailClient.emails.send({
            from: "email@mail.aolausoro.tech",
            to: ["adewoyin@aolausoro.tech"],
            subject: message.subject as string,
            html: output,
          });

          if (error) {
            captureException(error);
            throw new Error("Message not sent");
          }
          return { success: true, message: "Email sent successfully" };
        } catch (error) {
          captureException(error);
          throw new Error("Error sending email");
        }
      },
    );
  }
}
