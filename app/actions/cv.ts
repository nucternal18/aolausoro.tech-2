"use server";

import { auth } from "@clerk/nextjs/server";

import {
  withServerActionInstrumentation,
  captureException,
} from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";
import {
  createCvController,
  getCvsController,
} from "@src/interface-adapters/controllers/cv";

export async function getCV() {
  return await withServerActionInstrumentation(
    "getCV",
    { recordResponse: false },
    async () => {
      try {
        const response = await getCvsController();
        console.log("🚀 ~ response:", response);
        return response;
      } catch (err) {
        captureException(err);
        return {
          success: false,
          message:
            "An error happened while getting the CVs. The developers have been notified. Please try again later.",
          error: err,
        };
      }
    },
  );
}

export async function createCV(requestBody: FormData) {
  return await withServerActionInstrumentation(
    "createCV",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const data = Object.fromEntries(requestBody.entries());
        const response = await createCvController(data, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (err) {
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: "Must be logged in to create a todo" };
        }
        captureException(err);
        return {
          error:
            "An error happened while creating a todo. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}
