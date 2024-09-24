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
import { getUser } from "@app/actions/user";
import { uploadPDFCv } from "@app/actions/upload";
import { createCV } from "@app/actions/cv";
import type { ResponseProps } from "types/global";
import type { PartialUserProps } from "@src/entities/models/User";

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
      const { data, error, progress } = await uploadPDFCv(url, formData);
      if (progress && progress > 0) {
        dispatch(setUploadProgress(progress));
      }

      if (error) {
        toast({
          title: "Error!",
          description: error as string,
        });
        return;
      }

      const cvFormData = new FormData();
      cvFormData.append("cvUrl", data?.secure_url as string);

      const response = (await createCV(cvFormData)) as ResponseProps;

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
    progress: user.uploadProgress,
    uploadPDF,
  };
}
