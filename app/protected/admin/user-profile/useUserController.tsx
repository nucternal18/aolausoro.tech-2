"use client";
import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import {
  useUploadPDFCvMutation,
  useCreateCVMutation,
} from "@app/GlobalReduxStore/features/users/userApiSlice";
import { useAppDispatch, useAppSelector } from "@app/GlobalReduxStore/hooks";
import { useToast } from "@components/ui/use-toast";
import {
  setPDF,
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
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [uploadPDFCv, { isLoading: isUploading, isSuccess }] =
    useUploadPDFCvMutation();
  const [createCV, { isLoading: isCreating, isSuccess: isCreated }] =
    useCreateCVMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cvUrl: "",
    },
  });

  const pdfChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    if (file && types.includes(file.type)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        dispatch(setPDF(reader.result as string));
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Error uploading PDF. Please try again.",
        });
      };
    } else {
      toast({
        title: "Error",
        description: "Please select a PDF file.",
      });
    }
  };

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (values.pdf.length === 0) {
        toast({
          title: "Error",
          description: "Please select a PDF file.",
        });
        return;
      }
      console.log("useUserController ~ values", values);
      // const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
      // const data = user?.pdf;
      // try {
      //   const uploadPDFResponse = await uploadPDFCv({ url, data }).unwrap();
      //   const response = await createCV(uploadPDFResponse.pdf).unwrap();

      //   if (response.success) {
      //     form.reset();
      //     toast({
      //       title: "Success!",
      //       description: response.message,
      //     });
      //   }
      // } catch (error) {
      //   if (isFetchBaseQueryError(error)) {
      //     const errMsg =
      //       "error" in error ? error.error : JSON.stringify(error.message);
      //     toast({
      //       title: "Error!",
      //       description:
      //         (errMsg as string) || "Unable to upload PDF. Please try again.",
      //       action: <ToastAction altText="Retry">Retry</ToastAction>,
      //     });
      //   }
      //   if (isErrorWithMessage(error)) {
      //     toast({
      //       title: "Error",
      //       description: error.message,
      //     });
      //   }
      // }
    },
    [],
  );

  return {
    form,
    onSubmit,
    pdfChangeHandler,
    progress: user.uploadProgress,
    isUploading,
  };
}
