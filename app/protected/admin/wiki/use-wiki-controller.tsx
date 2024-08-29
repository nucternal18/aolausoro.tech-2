"use client";
import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import {
  useGetUserQuery,
  useUploadUserImageMutation,
} from "@app/GlobalReduxStore/features/users/userApiSlice";
import { useAppDispatch, useAppSelector } from "@app/GlobalReduxStore/hooks";
import { useToast } from "@components/ui/use-toast";
import {
  setUploadProgress,
  userSelector,
} from "@app/GlobalReduxStore/features/users/usersSlice";
import {
  isErrorWithMessage,
  isFetchBaseQueryError,
} from "@app/GlobalReduxStore/helper";
import {
  useGetWikisQuery,
  useCreateWikiMutation,
} from "@app/GlobalReduxStore/features/wiki/wikiApiSlice";
import { ToastAction } from "@components/ui/toast";

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

  const { data: userData, error, isLoading: isLoadingUser } = useGetUserQuery();
  const {
    data: wikis,
    isLoading: isLoadingWikis,
    refetch,
  } = useGetWikisQuery();

  const [uploadUserImage, { isLoading: isUploadingImage }] =
    useUploadUserImageMutation();
  const [createWiki] = useCreateWikiMutation();

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
      const uploadPDFResponse = await uploadUserImage({
        url,
        data: formData,
      }).unwrap();

      const data = {
        title: values.title,
        description: values.description,
        isImage: values.isImage,
        imageUrl: uploadPDFResponse.secure_url,
      };

      const response = await createWiki(data).unwrap();

      if (response.success) {
        form.reset();
        toast({
          title: "Success!",
          description: response.message,
        });
        refetch();
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
    userData,
    error,
    isLoadingUser,
    progress: user.uploadProgress,
    isUploadingImage,
    wikis,
    isLoadingWikis,
    uploadImage,
  };
}
