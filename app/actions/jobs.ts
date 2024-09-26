"use server";
import type {
  JobsProps,
  PartialJobProps,
  StatsProps,
} from "@src/entities/models/Job";
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

type QueryItemsProps = {
  [key: string]: string;
};

export async function getStats(): Promise<StatsProps> {
  return await withServerActionInstrumentation(
    "getStats",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const response = await getStatsController(userId as string);
        return response as StatsProps;
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

export async function getJobs(queryItems: QueryItemsProps): Promise<JobsProps> {
  return await withServerActionInstrumentation(
    "getJobs",
    { recordResponse: true },
    async () => {
      const { userId } = auth();
      try {
        const response = await getJobsController(queryItems, userId as string);
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

export async function getJobById(id: string): Promise<PartialJobProps> {
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
