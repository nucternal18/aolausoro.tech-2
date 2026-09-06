"use server";

import type { PartialWikiProps } from "@src/entities/models/Wiki";
import {
  withServerActionInstrumentation,
  captureException,
} from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError, NotFoundError } from "@src/entities/errors/common";
import {
  getWikiController,
  getWikiByIdController,
  createWikiController,
  updateWikiController,
  deleteWikiController,
} from "@src/interface-adapters/controllers/wiki";
import { auth } from "@clerk/nextjs/server";

export async function getWiki(): Promise<
  PartialWikiProps[] | { success: boolean; message: string }
> {
  return await withServerActionInstrumentation(
    "getWiki",
    { recordResponse: true },
    async () => {
      const { userId } = await auth();
      try {
        return await getWikiController(userId as string);
      } catch (error) {
        if (error instanceof InputParseError) {
          return { success: false, message: error.message };
        }
        if (error instanceof UnauthenticatedError) {
          return { success: false, message: "Must be logged in to get wikis" };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while getting wikis. The developers have been notified. Please try again later.",
        };
      }
    }
  );
}

export async function getWikiById(
  id: string
): Promise<PartialWikiProps | { success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "getWikiById",
    { recordResponse: true },
    async () => {
      const { userId } = await auth();
      try {
        const response = await getWikiByIdController(id, userId as string);
        return response;
      } catch (error) {
        if (error instanceof InputParseError) {
          return { success: false, message: error.message };
        }
        if (error instanceof UnauthenticatedError) {
          return { success: false, message: "Must be logged in to get a wiki" };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while getting a wiki. The developers have been notified. Please try again later.",
        };
      }
    }
  );
}

export async function createWiki(
  input: FormData
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "createWiki",
    { recordResponse: true },
    async () => {
      const { userId } = await auth();
      try {
        const formData = Object.fromEntries(input.entries());
        const response = await createWikiController(formData, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (error) {
        if (error instanceof InputParseError) {
          return { success: false, message: error.message };
        }
        if (error instanceof UnauthenticatedError) {
          return {
            success: false,
            message: "Must be logged in to create a wiki",
          };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while creating a wiki. The developers have been notified. Please try again later.",
        };
      }
    }
  );
}

export async function updateWiki(
  input: FormData
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "updateWiki",
    { recordResponse: true },
    async () => {
      const { userId } = await auth();
      try {
        const formData = Object.fromEntries(input.entries());
        const response = await updateWikiController(formData, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (error) {
        if (error instanceof InputParseError) {
          return { success: false, message: error.message };
        }
        if (error instanceof UnauthenticatedError) {
          return {
            success: false,
            message: "Must be logged in to update a wiki",
          };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while updating a wiki. The developers have been notified. Please try again later.",
        };
      }
    }
  );
}

export async function deleteWiki(
  id: string
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "deleteWiki",
    { recordResponse: true },
    async () => {
      const { userId } = await auth();
      try {
        const response = await deleteWikiController(id, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (error) {
        if (error instanceof InputParseError) {
          return { success: false, message: error.message };
        }
        if (error instanceof UnauthenticatedError) {
          return {
            success: false,
            message: "Must be logged in to delete a wiki",
          };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while deleting a wiki. The developers have been notified. Please try again later.",
        };
      }
    }
  );
}
