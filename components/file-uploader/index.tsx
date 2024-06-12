/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Jr58ICI47UK
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  useCallback,
  useState,
  type ChangeEventHandler,
  type FC,
  type SVGProps,
} from "react";
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import type { AxiosProgressEvent, CancelTokenSource } from "axios";
import { File, FileImage, FolderArchive } from "lucide-react";
import Dropzone from "react-dropzone";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Progress } from "@components/ui/progress";

interface FileUploadProgress {
  progress: number;
  File: File;
  source: CancelTokenSource | null;
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

export type TFileUploader = {
  form: UseFormReturn<
    {
      images: File[];
      pdf: File[];
      cvUrl?: string | undefined;
    },
    any,
    undefined
  >;
  progress: number;
  onSubmit: SubmitHandler<{
    images: File[];
    pdf: File[];
    cvUrl?: string | undefined;
  }>;
};

export default function FileUploader({
  form,
  progress,
  onSubmit,
}: TFileUploader) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Upload PDF File</CardTitle>
        <CardDescription>
          Drag and drop a PDF file or click to select a file to upload.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md p-8 cursor-pointer hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
                <UploadIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  Drop a PDF file here or click to upload
                </span>
              </div>
              <div className="sr-only" />
            </div>
            <FormField
              control={form.control}
              name="pdf"
              render={({ field: { onBlur, onChange }, fieldState }) => (
                <Dropzone
                  noClick
                  onDrop={(acceptedFiles) => {
                    form.setValue("pdf", acceptedFiles as File[], {
                      shouldValidate: true,
                    });
                  }}
                >
                  {({
                    getRootProps,
                    getInputProps,
                    open,
                    isDragActive,
                    acceptedFiles,
                  }) => (
                    <div>
                      <div
                        style={{
                          borderStyle: "dashed",
                          backgroundColor: isDragActive
                            ? `#808080`
                            : "transparent",
                        }}
                        {...getRootProps()}
                      >
                        <input
                          {...getInputProps({
                            id: "spreadsheet",
                            onChange,
                            onBlur,
                          })}
                        />

                        <p>
                          <button type="button" onClick={open}>
                            Choose a file
                          </button>{" "}
                          or drag and drop
                        </p>

                        {acceptedFiles && acceptedFiles.length > 0
                          ? acceptedFiles[0]?.name
                          : "No file selected."}

                        <div>
                          {fieldState.error && (
                            <span role="alert">{fieldState.error.message}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Dropzone>
              )}
            />
            <Button type="submit" className="w-full mt-4">
              Upload
            </Button>
          </form>
        </Form>
        <Progress value={progress} />
      </CardContent>
    </Card>
  );
}

function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
