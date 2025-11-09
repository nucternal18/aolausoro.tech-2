import { useCallback, type SVGProps } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";

import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";

import Image from "next/image";
import { Typography } from "@components/Typography";
import { FormField } from "@components/ui/form";
import type { UseFormReturn } from "react-hook-form";

interface TFileInputProps {
  label?: string;
  name: "images" | "title" | "description" | "isImage";
  mode?: "update" | "append";
  multiple?: boolean;
  form: UseFormReturn<
    {
      title: string;
      description: string;
      isImage: boolean;
      images: File[];
    },
    any,
    any
  >;
}

export default function ImageFileInput(props: TFileInputProps) {
  const { form, name, label = "" } = props;

  const files: File[] = form.watch(name) as File[];
  const onDrop: DropzoneOptions["onDrop"] = useCallback(
    (droppedFiles: File[]) => {
      form.setValue(name, droppedFiles);
    },
    [form, name]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: props.multiple,
  });

  return (
    <Card className="container mx-auto w-full">
      <CardContent className="pt-4 space-y-4">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <div {...getRootProps()} className="space-y-4">
              <div className="flex gap-2 justify-center items-center p-8 rounded-md border-2 border-gray-300 border-dashed cursor-pointer hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500">
                <label
                  className="flex items-center mb-2 space-x-2 text-sm font-bold text-gray-700 capitalize"
                  htmlFor={name}
                >
                  <UploadIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-base text-gray-500 dark:text-gray-400">
                    {label}
                  </span>
                </label>

                <Input
                  type="file"
                  accept="image/png, image/jpeg"
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
          <p className="my-2 text-center">Dropped Files</p>
          {/* Optionally you may display a preview of the file(s) */}
          {!!files?.length && (
            <div className="grid relative grid-cols-1 gap-1 mt-2 sm:grid-cols-2 md:grid-cols-3">
              {files.map((file) => {
                if (file.type.includes("image")) {
                  return (
                    <div key={file.name} className="relative w-full">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={100}
                        height={100}
                        style={{
                          height: "auto",
                        }}
                      />
                    </div>
                  );
                }
                return (
                  <div
                    key={file.name}
                    className="flex justify-between items-center p-2 w-full rounded-md border border-gray-300"
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
