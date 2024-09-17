"use server";

import prisma from "@lib/prismadb";
import { auth } from "@clerk/nextjs/server";

import type { UploadApiResponse } from "cloudinary";

import axios, { AxiosError } from "axios";
import {
  partialUserSchema,
  type PartialUserProps,
} from "@src/entities/models/User";
import { partialCvSchema, type PartialCvProps } from "@src/entities/models/cv";

export async function getUser(clerkId: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be signed in to add an item to your cart");
  }

  if (userId !== clerkId) {
    throw new Error("You are not authorized to view this user");
  }

  return await prisma.user.findUnique({
    where: { clerkId },
  });
}

export async function updateUser(requestBody: PartialUserProps) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("You must be signed in to add an item to your cart");
  }

  const validation = partialUserSchema.safeParse(requestBody);

  if (!validation.success) {
    throw new Error(JSON.stringify(validation.error.errors));
  }

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      name: requestBody.displayName,
      image: requestBody.image,
      email: requestBody.email,
    },
  });

  return { success: true, message: "User updated successfully" };
}

export async function getCV() {
  const cv = await prisma.cV.findMany({
    select: {
      id: true,
      cvUrl: true,
      createdAt: true,
    },
  });

  return cv;
}

export async function createCV(requestBody: PartialCvProps) {
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

  const validation = partialCvSchema.safeParse(requestBody);

  if (!validation.success) {
    throw new Error(JSON.stringify(validation.error.errors));
  }

  await prisma.cV.create({
    data: {
      cvUrl: requestBody.cvUrl as string,
      user: { connect: { clerkId: userId } },
    },
  });

  return { success: true, message: "CV created successfully" };
}

/**
 * Uploads a user image to the specified URL.
 *
 * @param url - The URL to upload the image to.
 * @param data - The FormData containing the image data.
 * @returns An object containing the upload progress and the response data, or an error object if an error occurred.
 * @throws Error if the user is not signed in or is not authorized to perform the operation.
 */
export async function uploadUserImage(url: string, data: FormData) {
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
}

export async function uploadPDFCv(url: string, data: FormData) {
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
}
