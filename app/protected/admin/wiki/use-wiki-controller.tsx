"use client";
import React, { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { useAppDispatch, useAppSelector } from "@app/global-redux-store/hooks";
import { useToast } from "@components/ui/use-toast";
import {
  setUploadProgress,
  userSelector,
} from "@app/global-redux-store/features/users/usersSlice";
import {
  isErrorWithMessage,
  isFetchBaseQueryError,
} from "@app/global-redux-store/helper";

import { ToastAction } from "@components/ui/toast";
import { createWiki, getWiki } from "@app/actions/wiki";
import { uploadUserImage } from "@app/actions/upload";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  isImage: z.boolean(),
  images: z.array(z.instanceof(File)),
});

export type FormValues = z.infer<typeof formSchema>;

const types = ["image/png", "image/jpg", "image/jpeg"];

/**
 * Custom hook for managing wiki functionality.
 *
 * @returns An object containing the form, user data, error, loading status, progress, and functions related to wiki management.
 */
export default function useWikiController() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isImage: false,
      images: [],
    },
  });

  /**
   * Uploads an image to the server.
   *
   * @param values - The form values containing the image file.
   */
  const uploadImage: SubmitHandler<FormValues> = useCallback(async (values) => {
    if (values.images.length === 0) {
      toast({
        title: "Error",
        description: "Please select a PDF file.",
      });
      return;
    }
    const validTypes = values.images.every((file) => {
      console.log(file.type);
      return types.includes(file.type);
    });

    if (!validTypes) {
      toast({
        title: "Error",
        description: "Only PNG and JPG files are allowed.",
      });
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`;
    const data = values.images[0] as File;
    const formData = new FormData();
    formData.append("file", data, data.name);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string,
    );

    try {
      const {
        data: uploadPDFResponse,
        error,
        progress,
      } = await uploadUserImage(url, formData);

      const wikiFormData = new FormData();
      wikiFormData.append("title", values.title);
      wikiFormData.append("description", values.description);
      wikiFormData.append("isImage", values.isImage.toString());
      wikiFormData.append("imageUrl", uploadPDFResponse?.secure_url || "");

      if (progress && progress > 0) {
        dispatch(setUploadProgress(progress));
      }

      if (error) {
        toast({
          title: "Error!",
          description: error as string,
        });
      }
      const response = await createWiki(wikiFormData);

      if (response.success) {
        form.reset();
        toast({
          title: "Success!",
          description: response.message,
        });

        dispatch(setUploadProgress(0));
      }
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const errMsg =
          "error" in error ? error.error : JSON.stringify(error.message);
        toast({
          title: "Error!",
          description:
            (errMsg as string) || "Unable to upload PDF. Please try again.",
          action: <ToastAction altText="Retry">Retry</ToastAction>,
        });
      }
      if (isErrorWithMessage(error)) {
        toast({
          title: "Error",
          description: error.message,
        });
      }
      dispatch(setUploadProgress(0));
    }
  }, []);

  return {
    form,
    progress: user.uploadProgress,
    uploadImage,
  };
}
