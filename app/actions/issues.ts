"use server";

import {
  withServerActionInstrumentation,
  captureException,
} from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError, NotFoundError } from "@src/entities/errors/common";
import {
  getIssuesController,
  getIssueByIdController,
  createIssueController,
  updateIssueController,
  deleteIssueController,
} from "@src/interface-adapters/controllers/issues";
import { auth } from "@clerk/nextjs/server";

export async function getIssues() {
  return await withServerActionInstrumentation(
    "getIssues",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const response = await getIssuesController(userId as string);
        return response;
      } catch (error) {
        if (error instanceof UnauthenticatedError) {
          throw error;
        }
        captureException(error);
        throw error;
      }
    },
  );
}

export async function getIssueById(id: string) {
  return await withServerActionInstrumentation(
    "getIssueById",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const response = await getIssueByIdController(id, userId as string);
        return response;
      } catch (error) {
        if (error instanceof UnauthenticatedError) {
          throw error;
        }
        captureException(error);
        throw error;
      }
    },
  );
}

export async function createIssue(input: FormData) {
  return await withServerActionInstrumentation(
    "createIssue",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const data = Object.fromEntries(input.entries());
        const response = await createIssueController(data, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (error) {
        if (error instanceof InputParseError) {
          throw error;
        }
        if (error instanceof UnauthenticatedError) {
          throw error;
        }
        captureException(error);
        throw error;
      }
    },
  );
}

export async function updateIssue(input: FormData) {
  return await withServerActionInstrumentation(
    "updateIssue",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const data = Object.fromEntries(input.entries());
        const response = await updateIssueController(data, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (error) {
        if (error instanceof InputParseError) {
          throw error;
        }
        if (error instanceof UnauthenticatedError) {
          throw error;
        }
        captureException(error);
        throw error;
      }
    },
  );
}

export async function deleteIssue(id: string) {
  return await withServerActionInstrumentation(
    "deleteIssue",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const response = await deleteIssueController(id, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (error) {
        if (error instanceof UnauthenticatedError) {
          throw error;
        }
        captureException(error);
        throw error;
      }
    },
  );
}
