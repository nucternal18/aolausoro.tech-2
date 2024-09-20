"use server";
import type { PartialJobProps, StatsProps } from "@src/entities/models/Job";
import {
  withServerActionInstrumentation,
  captureException,
} from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError } from "@src/entities/errors/common";
import {
  getJobsController,
  getJobByIdController,
  createJobController,
  updateJobController,
  deleteJobController,
  getStatsController,
} from "@src/interface-adapters/controllers/jobs";
import { auth } from "@clerk/nextjs/server";

export async function getStats(): Promise<
  StatsProps | { success: boolean; message: string }
> {
  return await withServerActionInstrumentation(
    "getStats",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const response = await getStatsController(userId as string);
        return response as StatsProps;
      } catch (error) {
        if (error instanceof InputParseError) {
          return { success: false, message: error.message };
        }
        if (error instanceof UnauthenticatedError) {
          return { success: false, message: "Must be logged in to get stats" };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while getting stats. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}

export async function getJobs(): Promise<
  PartialJobProps[] | { success: boolean; message: string }
> {
  return await withServerActionInstrumentation(
    "getJobs",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const response = await getJobsController(userId as string);
        return response;
      } catch (error) {
        if (error instanceof InputParseError) {
          return { success: false, message: error.message };
        }
        if (error instanceof UnauthenticatedError) {
          return { success: false, message: "Must be logged in to get jobs" };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while getting jobs. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}

export async function getJobById(
  id: string,
): Promise<PartialJobProps | { success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "getJobById",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const response = await getJobByIdController(id, userId as string);
        return response;
      } catch (error) {
        if (error instanceof InputParseError) {
          return { success: false, message: error.message };
        }
        if (error instanceof UnauthenticatedError) {
          return { success: false, message: "Must be logged in to get a job" };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while getting a job. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}

export async function createJob(
  input: FormData,
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "createJob",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const formData = Object.fromEntries(input.entries());
        const response = await createJobController(formData, userId as string);
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
            message: "Must be logged in to create a job",
          };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while creating a job. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}

export async function updateJob(
  input: FormData,
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "updateJob",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const formData = Object.fromEntries(input.entries());
        const response = await updateJobController(formData, userId as string);
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
            message: "Must be logged in to update a job",
          };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while updating a job. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}

export async function deleteJob(
  id: string,
): Promise<{ success: boolean; message: string }> {
  return await withServerActionInstrumentation(
    "deleteJob",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const response = await deleteJobController(id, userId as string);
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
            message: "Must be logged in to delete a job",
          };
        }
        captureException(error);
        return {
          success: false,
          message:
            "An error happened while deleting a job. The developers have been notified. Please try again later.",
        };
      }
    },
  );
}
