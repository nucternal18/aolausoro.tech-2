"use server";
import type { PartialProjectProps } from "@src/entities/models/Project";
import {
  withServerActionInstrumentation,
  captureException,
} from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";
import {
  getProjectsController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
} from "@src/interface-adapters/controllers/projects";
import { auth } from "@clerk/nextjs/server";

export async function getProjects(): Promise<
  PartialProjectProps[] | { success: boolean; message: string }
> {
  return await withServerActionInstrumentation(
    "getProjects",
    { recordResponse: false },
    async () => {
      const { userId } = auth();

      try {
        const response = await getProjectsController();
        return response;
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          return {
            success: false,
            message: "Must be logged in to get projects",
          };
        }
        captureException(err);
        return {
          success: false,
          message:
            "An error happened while getting projects. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}

export async function getProjectById(
  id: string,
): Promise<PartialProjectProps | { success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "getProjectById",
    { recordResponse: false },
    async () => {
      const { userId } = auth();

      try {
        const response = await getProjectByIdController(id, userId as string);
        return response;
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          return {
            success: false,
            message: "Must be logged in to get a project",
          };
        }
        captureException(err);
        return {
          success: false,
          message:
            "An error happened while getting a project. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}

export async function createProject(
  input: FormData,
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "createProject",
    { recordResponse: true },
    async () => {
      const { userId } = auth();

      try {
        const data = Object.fromEntries(input.entries());
        const response = await createProjectController(data, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (err) {
        if (err instanceof InputParseError) {
          return { success: false, message: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return {
            success: false,
            message: "Must be logged in to create a project",
          };
        }
        captureException(err);
        return {
          success: false,
          message:
            "An error happened while creating a project. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}

export async function updateProject(
  input: FormData,
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "updateProject",
    { recordResponse: true },
    async () => {
      const { userId } = auth();

      try {
        const data = Object.fromEntries(input.entries());
        const response = await updateProjectController(data, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (err) {
        if (err instanceof InputParseError) {
          return { success: false, message: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return {
            success: false,
            message: "Must be logged in to update a project",
          };
        }
        captureException(err);
        return {
          success: false,
          message:
            "An error happened while updating a project. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}

export async function deleteProject(
  id: string,
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "deleteProject",
    { recordResponse: true },
    async () => {
      const { userId } = auth();

      try {
        const response = await deleteProjectController(id, userId as string);
        if (response.success) {
          revalidatePath("/");
        }
        return response;
      } catch (err) {
        if (err instanceof InputParseError) {
          return { success: false, message: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return {
            success: false,
            message: "Must be logged in to delete a project",
          };
        }
        captureException(err);
        return {
          success: false,
          message:
            "An error happened while deleting a project. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}
