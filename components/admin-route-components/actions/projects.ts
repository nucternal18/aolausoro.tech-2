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

export async function getProjects(): Promise<PartialProjectProps[]> {
  return await withServerActionInstrumentation(
    "getProjects",
    { recordResponse: false },
    async () => {
      try {
        return await getProjectsController();
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          throw err;
        }
        captureException(err);
        throw err;
      }
    }
  );
}

export async function getProjectById(id: string): Promise<PartialProjectProps> {
  return await withServerActionInstrumentation(
    "getProjectById",
    { recordResponse: false },
    async () => {
      const { userId } = await auth();

      try {
        return await getProjectByIdController(id, userId as string);
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          throw err;
        }
        captureException(err);
        throw err;
      }
    }
  );
}

export async function createProject(
  input: FormData
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "createProject",
    { recordResponse: true },
    async () => {
      const { userId } = await auth();

      try {
        const data = Object.fromEntries(input.entries());
        const response = await createProjectController(data, userId as string);
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
    }
  );
}

export async function updateProject(
  input: FormData
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "updateProject",
    { recordResponse: true },
    async () => {
      const { userId } = await auth();

      try {
        const data = Object.fromEntries(input.entries());
        const response = await updateProjectController(data, userId as string);
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
    }
  );
}

export async function deleteProject(
  id: string
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "deleteProject",
    { recordResponse: true },
    async () => {
      const { userId } = await auth();

      try {
        const response = await deleteProjectController(id, userId as string);
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
    }
  );
}
