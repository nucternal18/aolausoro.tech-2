"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useUploadPDFCvMutation } from "@app/GlobalReduxStore/features/users/userApiSlice";

const formSchema = z.object({
  cvUrl: z.string().url().optional(),
  images: z.array(z.instanceof(File)),
  pdf: z.array(z.instanceof(File)),
});

export default function useUserController() {
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [uploadPDFCv, { isLoading, isSuccess }] = useUploadPDFCvMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cvUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // create a function that calculates the progress of the upload
    const calculateProgress = (event: ProgressEvent) => {
      setProgress(Math.round((event.loaded / event.total) * 100));
    };

    // create a new FormData instance
    const formData = new FormData();

    // append the pdf to the formData
    formData.append("pdf", values.pdf[0] as Blob);

    // call the uploadPDFCv mutation with the formData
  }

  return {
    form,
    onSubmit,
  };
}
