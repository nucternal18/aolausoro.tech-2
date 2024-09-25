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
        return response;
      } catch (err) {
        captureException(err);
        throw err;
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
          throw err;
        }
        if (err instanceof UnauthenticatedError) {
          throw err;
        }
        captureException(err);
        throw err;
      }
    },
  );
}
