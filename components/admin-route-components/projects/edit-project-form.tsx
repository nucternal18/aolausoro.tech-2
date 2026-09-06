"use client";

import React from "react";
import Image from "next/image";

// components
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
import { Switch } from "@components/ui/switch";
import { Textarea } from "@components/ui/textarea";
import UploadForm from "@components/forms/upload-form";

// controller
import useProjectController from "./use-project-controller";
import type { PartialProjectProps } from "@src/entities/models/Project";

export function EditProjectForm({ project }: { project: PartialProjectProps }) {
  const controlledTechStack = project?.techStack?.map((stack: string) => {
    return {
      content: stack,
    };
  });
  const defaultValues = {
    published: project.published,
    projectName: project.projectName,
    github: project.github,
    address: project.address,
    description: project.description,
    controlledTechStack: controlledTechStack,
  };

  const {
    form,
    formField,
    projectImage,
    imageChangeHandler,
    createProjectHandler,
  } = useProjectController();

  React.useEffect(() => {
    if (project) {
      form.reset({ ...defaultValues });
    }
  }, [project]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(createProjectHandler)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Security emails</FormLabel>
                  <FormDescription>
                    Receive emails about your account security.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                    aria-readonly
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="w-full h-[400px] border-2 p-2 flex flex-col items-center justify-center space-y-4  mb-4 border-gray-600 ">
            {projectImage ? (
              <Image
                src={projectImage}
                alt="Project image"
                width={250}
                height={250}
              />
            ) : (
              <UploadForm changeHandler={imageChangeHandler} />
            )}
          </div>

          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a project name" {...field} />
                </FormControl>
                <FormDescription>The name of the Project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a github URL..."
                    type="url"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The GitHub address of your project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live Web Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a web URL..."
                    type="url"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The web address of the project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mb-6 grid grid-cols-1 gap-2 md:items-center bg-gray-100 dark:bg-gray-800 ">
            <Button
              type="button"
              variant="outline"
              onClick={() => formField.append({ content: "" })}
            >
              APPEND TECH STACK
            </Button>
            {formField.fields.map((field, idx) => {
              return (
                <div
                  className="bg-gray-100 dark:bg-gray-800 w-full mb-2 flex space-x-2"
                  key={`${field}-${idx}`}
                >
                  <input
                    {...form.register(`controlledTechStack.${idx}.content`)}
                    className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                  <Button
                    type="button"
                    onClick={() => formField.remove(idx)}
                    className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2  transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
                  >
                    DELETE
                  </Button>
                </div>
              );
            })}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your message"
                    className="resize-y h-24"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is a summary of what the project is about.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
