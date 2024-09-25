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
  updateUserController,
  getUserController,
} from "@src/interface-adapters/controllers/user";

export async function getUser() {
  return await withServerActionInstrumentation(
    "getUser",
    { recordResponse: false },
    async () => {
      const { userId } = auth();

      try {
        const response = await getUserController(userId as string);
        return response;
      } catch (err) {
        captureException(err);
        throw err;
      }
    },
  );
}

export async function updateUser(requestBody: FormData) {
  return await withServerActionInstrumentation(
    "createTodo",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const data = Object.fromEntries(requestBody.entries());
        const response = await updateUserController(data, userId as string);
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
