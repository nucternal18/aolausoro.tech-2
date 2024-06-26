"use client";
import type { PartialUserProps } from "schema/User";
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

import useUserController from "./useUserController";
import PDFFileInput from "@components/file-uploader/PDFFileInput";
import { Progress } from "@components/ui/progress";

interface IUserProfile {
  randomImage: string;
  user: PartialUserProps;
}

function UserProfileComponent({ randomImage, user }: IUserProfile) {
  const { form, uploadPDF, progress, isUploading } = useUserController();

  return (
    <section className="relative pb-2 h-full justify-center items-center container mx-auto">
      <div className="flex flex-col pb-5">
        <div className="relative flex-col mb-7 space-y-8">
          <div className="flex flex-col justify-center items-center">
            <img
              className="w-full h-[300px] shadow-lg object-cover"
              src={randomImage}
              alt="banner-pic"
            />
            <img
              src={user?.image}
              alt="user-pic"
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user?.name}
            </h1>
          </div>

          <div className="px-2 space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(uploadPDF)}
                className="space-y-8"
              >
                <PDFFileInput
                  multiple
                  name="pdf"
                  label="Drop a PDF file here or click to upload"
                  form={form}
                />
                <FormField
                  control={form.control}
                  name="cvUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary/80">CV Url</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="enter a URL"
                          className="text-primary/80"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the url to your CV for employers to view
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isUploading} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
            <Progress value={progress} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserProfileComponent;
