import {
  withServerActionInstrumentation,
  captureException,
} from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import prisma from "@lib/prismadb";

import { UnauthenticatedError } from "@src/entities/errors/auth";
import { InputParseError, NotFoundError } from "@src/entities/errors/common";
import { auth } from "@clerk/nextjs/server";
import type { UploadApiResponse } from "cloudinary";
import axios, { AxiosError } from "axios";

/**
 * Uploads a user image to the specified URL.
 *
 * @param url - The URL to upload the image to.
 * @param data - The FormData containing the image data.
 * @returns An object containing the upload progress and the response data, or an error object if an error occurred.
 * @throws Error if the user is not signed in or is not authorized to perform the operation.
 */
export async function uploadUserImage(url: string, data: FormData) {
  return await withServerActionInstrumentation(
    "uploadUserImage",
    { recordResponse: false },
    async () => {
      const { userId } = auth();

      if (!userId) {
        throw new Error("You must be signed in to add an item to your cart");
      }

      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user?.isAdmin) {
        throw new Error("You are not authorized to perform this operation");
      }

      try {
        let progress = 0;
        const result = await axios.post(url, data, {
          //...other options like headers here
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (upload) => {
            //Set the progress value to show the progress bar
            const uploadloadProgress = Math.round(
              (100 * upload.loaded) / (upload.total as number),
            );
            progress = uploadloadProgress;
          },
        });

        return { progress, data: result.data as UploadApiResponse };
      } catch (axiosError: any) {
        if (axiosError instanceof InputParseError) {
          return { error: axiosError.message };
        }
        if (axiosError instanceof UnauthenticatedError) {
          return { error: "Must be logged in to create a todo" };
        }
        captureException(axiosError);
        if (axiosError instanceof AxiosError) {
          const err = axiosError;
          return {
            error: {
              status: err.response?.status,
              data: err.response?.data || err.message,
            },
          };
        }
        return {
          error: {
            status: 500,
            data: "Something went wrong uploading image",
          },
        };
      }
    },
  );
}

export async function uploadPDFCv(url: string, data: FormData) {
  return await withServerActionInstrumentation(
    "uploadPDFCv",
    { recordResponse: false },
    async () => {
      const { userId } = auth();

      if (!userId) {
        throw new Error("You must be signed in to add an item to your cart");
      }

      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user?.isAdmin) {
        throw new Error("You are not authorized to perform this operation");
      }

      try {
        let progress = 0;
        const result = await axios.post(url, data, {
          //...other options like headers here
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (upload) => {
            //Set the progress value to show the progress bar
            const uploadloadProgress = Math.round(
              (100 * upload.loaded) / (upload.total as number),
            );
            if (uploadloadProgress < 100) {
              progress = uploadloadProgress;
            }
          },
        });

        return { data: result.data as UploadApiResponse, progress };
      } catch (axiosError: any) {
        if (axiosError instanceof InputParseError) {
          return { error: axiosError.message };
        }
        if (axiosError instanceof UnauthenticatedError) {
          return { error: "Must be logged in to create a todo" };
        }
        captureException(axiosError);
        if (axiosError instanceof AxiosError) {
          const err = axiosError;
          return {
            error: {
              status: err.response?.status,
              data: err.response?.data || err.message,
            },
          };
        }
        return {
          error: {
            status: 500,
            data: "Something went wrong uploading image",
          },
        };
      }
    },
  );
}
