"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import ImageFileInput from "@components/file-uploader/ImageFileInput";
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
import { ScrollArea } from "@components/ui/scroll-area";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Checkbox } from "@components/ui/checkbox";
import { DialogClose } from "@radix-ui/react-dialog";
import useWikiController from "./useWikiController";
import { Typography } from "@components/Typography";

export function UploadImageModal() {
  const { form, uploadImage } = useWikiController();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary border-primary">
          Upload Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="h3" className="text-primary">
              Upload an Image.
            </Typography>
          </DialogTitle>
          <DialogDescription>
            Drag and drop an Image file or click to select a file to upload.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(uploadImage)}
              className="space-y-8"
            >
              <ImageFileInput
                multiple
                name="images"
                label="Drop an Image file here or click to upload"
                form={form}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary/70">Title</FormLabel>
                    <FormControl>
                      <Input
                        className="text-primary/80"
                        placeholder="enter a title"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The title of the wiki.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary/70">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="enter a brief description"
                        className="resize-none text-primary/80"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of the wiki.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isImage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-primary/80">
                        Is this an image?
                      </FormLabel>
                      <FormDescription>
                        Check this box if the file is an image.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogClose asChild>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
