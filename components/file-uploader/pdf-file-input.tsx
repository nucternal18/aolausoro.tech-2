/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Jr58ICI47UK
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useCallback, type SVGProps } from "react";
import { type DropzoneOptions, useDropzone, type Accept } from "react-dropzone";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/ui/card";
import { Input } from "@components/ui/input";

import Image from "next/image";
import { Typography } from "@components/typography";
import { FormField } from "@components/ui/form";
import type { UseFormReturn } from "react-hook-form";

interface TFileInputProps {
  label?: string;
  name: "cvUrl" | "images" | "pdf";
  mode?: "update" | "append";
  multiple?: boolean;
  form: UseFormReturn<
    {
      images: File[];
      pdf: File[];
      cvUrl?: string | undefined;
    },
    any,
    undefined
  >;
}

export default function PDFFileInput(props: TFileInputProps) {
  const { form, name, label = "" } = props;

  const files: File[] = form.watch(name) as File[];
  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    (droppedFiles: File[]) => {
      form.setValue(name, droppedFiles);
    },
    [form, name],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: props.multiple,
  });

  return (
    <Card className="w-full container mx-auto">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3" className="text-primary">
            Upload PDF File or Enter the URL.
          </Typography>
        </CardTitle>
        <CardDescription>
          Drag and drop a PDF file or click to select a file to upload.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="pdf"
          render={({ field }) => (
            <div {...getRootProps()} className="space-y-4">
              <div className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md p-8 cursor-pointer hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
                <label
                  className="flex items-center text-gray-700 text-sm font-bold space-x-2 mb-2 capitalize"
                  htmlFor={name}
                >
                  <UploadIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 text-base">
                    {label}
                  </span>
                </label>

                <Input
                  type="file"
                  accept="application/pdf, image/*"
                  id={name}
                  {...getInputProps()}
                />
              </div>
              <div className="sr-only" />
            </div>
          )}
        />
        <div
          className={
            "w-full p-2 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500" +
            (isDragActive ? "hover:bg-neutral-400" : "")
          }
        >
          <p className="text-center my-2">Dropped Files</p>
          {/* Optionally you may display a preview of the file(s) */}
          {!!files?.length && (
            <div className="relative grid gap-1 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-2">
              {files.map((file) => {
                if (file.type.includes("image")) {
                  return (
                    <div key={file.name} className="relative w-full h-20">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  );
                }
                return (
                  <div
                    key={file.name}
                    className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md"
                  >
                    <Typography className="text-primary/80">
                      {file.name}
                    </Typography>
                    <Typography className="text-primary/80">
                      {file.size} bytes
                    </Typography>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
