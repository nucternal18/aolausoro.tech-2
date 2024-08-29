"use client";
import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import {
  useGetUserQuery,
  useUploadPDFCvMutation,
  useCreateCVMutation,
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
import { ToastAction } from "@components/ui/toast";

const formSchema = z.object({
  cvUrl: z.string().url().optional(),
  images: z.array(z.instanceof(File)),
  pdf: z.array(z.instanceof(File)),
});

export type FormValues = z.infer<typeof formSchema>;

const types = ["application/pdf"];

export default function useUserController() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(userSelector);
  const { toast } = useToast();

  const { data: userData, error, isLoading: isLoadingUser } = useGetUserQuery();

  const [uploadPDFCv, { isLoading: isUploading }] = useUploadPDFCvMutation();
  const [createCV] = useCreateCVMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cvUrl: "",
      images: [],
      pdf: [],
    },
  });

  const uploadPDF: SubmitHandler<FormValues> = useCallback(async (values) => {
    if (values.pdf.length === 0) {
      toast({
        title: "Error",
        description: "Please select a PDF file.",
      });
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`;
    const data = values.pdf[0] as File;
    const formData = new FormData();
    formData.append("file", data, data.name);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string,
    );

    try {
      const uploadPDFResponse = await uploadPDFCv({
        url,
        data: formData,
      }).unwrap();

      const response = await createCV(uploadPDFResponse.secure_url).unwrap();

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
    }
  }, []);

  return {
    form,
    userData,
    error,
    isLoadingUser,
    progress: user.uploadProgress,
    isUploading,
    uploadPDF,
  };
}
