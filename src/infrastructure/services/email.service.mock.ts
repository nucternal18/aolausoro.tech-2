import { inject, injectable } from "inversify";

import type { IEmailService } from "@src/application/services/email.service.interface";
import type { PartialMessageProps } from "@src/entities/models/Message";
import type { Resend } from "resend";
import type { ResponseProps } from "types/global";

@injectable()
export class MockEmailService implements IEmailService {
  private _emailService: Resend;

  constructor() {
    this._emailService = {
      emails: {
        send: async ({
          from,
          to,
          subject,
          html,
        }: {
          from: string;
          to: string | string[];
          subject: string;
          html: string;
        }) => {
          console.log(
            `Mock email sent from ${from} to ${to} with subject "${subject}" and body "${html}"`,
          );
          const data = {
            success: true,
            message: "Mock email sent successfully",
          };
          return { data, error: null };
        },
      },
    } as unknown as Resend; // Mock Resend instance
  }

  async sendEmail(message: PartialMessageProps): Promise<ResponseProps> {
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

    console.log(`Mock email sent from: ${output} `);

    // Simulate sending an email
    const { data, error } = await this._emailService.emails.send({
      from: "email@mail.aolausoro.tech",
      to: ["adewoyin@aolausoro.tech"],
      subject: message.subject as string,
      html: output,
    });
    console.log(data);
    return { success: true, message: "Mock email sent successfully" };
  }
}
