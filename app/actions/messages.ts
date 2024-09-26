"use server";
import type { PartialMessageProps } from "@src/entities/models/Message";
import {
  withServerActionInstrumentation,
  captureException,
} from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";
import {
  getMessagesController,
  getMessageByIdController,
  createMessageController,
  deleteMessageController,
} from "@src/interface-adapters/controllers/messages";
import { sendEmailController } from "@src/interface-adapters/controllers/email";
import { auth } from "@clerk/nextjs/server";

export async function getMessages(): Promise<PartialMessageProps[]> {
  return await withServerActionInstrumentation(
    "getMessages",
    { recordResponse: false },
    async () => {
      const { userId } = auth();

      try {
        const response = await getMessagesController(userId as string);
        return response;
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          throw new Error("Must be logged in to get messages");
        }
        captureException(err);
        throw new Error(
          "An error happened while getting messages. The developers have been notified. Please try again later.",
        );
      }
    },
  );
}

export async function getMessageById(
  id: string,
): Promise<PartialMessageProps | undefined> {
  return await withServerActionInstrumentation(
    "getMessageById",
    { recordResponse: false },
    async () => {
      const { userId } = auth();

      try {
        const response = await getMessageByIdController(id, userId as string);
        return response;
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          throw new Error("Must be logged in to get a message");
        }
        captureException(err);
        throw new Error(
          "An error happened while getting a message. The developers have been notified. Please try again later.",
        );
      }
    },
  );
}

export async function createMessage(
  input: FormData,
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "createMessage",
    { recordResponse: true },
    async () => {
      const { userId } = auth();

      try {
        const formData = Object.fromEntries(input.entries());
        const response = await createMessageController(
          formData,
          userId as string,
        );
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          throw new Error("Must be logged in to create a message");
        }
        if (err instanceof InputParseError) {
          return { success: false, message: "Invalid input" };
        }
        captureException(err);
        throw new Error(
          "An error happened while creating a message. The developers have been notified. Please try again later.",
        );
      }
    },
  );
}

export async function deleteMessage(
  id: string,
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "deleteMessage",
    { recordResponse: true },
    async () => {
      const { userId } = auth();

      try {
        const response = await deleteMessageController(id, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          throw new Error("Must be logged in to delete a message");
        }
        captureException(err);
        throw new Error(
          "An error happened while deleting a message. The developers have been notified. Please try again later.",
        );
      }
    },
  );
}

export async function sendMail(
  input: FormData,
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "sendMail",
    { recordResponse: true },
    async () => {
      try {
        const formData = Object.fromEntries(input.entries());
        const response = await sendEmailController(formData);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          throw new Error("Must be logged in to send a mail");
        }
        captureException(err);
        throw new Error(
          "An error happened while sending a mail. The developers have been notified. Please try again later.",
        );
      }
    },
  );
}
