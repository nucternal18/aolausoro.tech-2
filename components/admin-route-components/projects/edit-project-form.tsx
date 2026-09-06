'use client'

import React from 'react'
import Image from 'next/image'

// components
import { Button } from '@components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form'
import { Input } from '@components/ui/input'
import { Switch } from '@components/ui/switch'
import { Textarea } from '@components/ui/textarea'
import UploadForm from '@components/forms/upload-form'

// controller
import useProjectController from './use-project-controller'
import type { PartialProjectProps } from '@src/entities/models/Project'

export function EditProjectForm({ project }: { project: PartialProjectProps }) {
  const controlledTechStack = project?.techStack?.map((stack: string) => {
    return {
      content: stack,
    }
  })
  const defaultValues = {
    published: project.published,
    projectName: project.projectName,
    github: project.github,
    address: project.address,
    description: project.description,
    controlledTechStack: controlledTechStack,
  }

  const { form, formField, projectImage, imageChangeHandler, createProjectHandler } =
    useProjectController()

  React.useEffect(() => {
    if (project) {
      form.reset({ ...defaultValues })
    }
  }, [project])

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createProjectHandler)} className="space-y-8">
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Security emails</FormLabel>
                  <FormDescription>Receive emails about your account security.</FormDescription>
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
          <div className="mb-4 flex h-[400px] w-full flex-col items-center justify-center space-y-4 border-2 border-gray-600 p-2">
            {projectImage ? (
              <Image src={projectImage} alt="Project image" width={250} height={250} />
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
                  <Input placeholder="Enter a github URL..." type="url" {...field} />
                </FormControl>
                <FormDescription>The GitHub address of your project.</FormDescription>
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
                  <Input placeholder="Enter a web URL..." type="url" {...field} />
                </FormControl>
                <FormDescription>The web address of the project.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mb-6 grid grid-cols-1 gap-2 bg-gray-100 md:items-center dark:bg-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => formField.append({ content: '' })}
            >
              APPEND TECH STACK
            </Button>
            {formField.fields.map((field, idx) => {
              return (
                <div
                  className="mb-2 flex w-full space-x-2 bg-gray-100 dark:bg-gray-800"
                  key={`${field}-${idx}`}
                >
                  <input
                    {...form.register(`controlledTechStack.${idx}.content`)}
                    className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                  <Button
                    type="button"
                    onClick={() => formField.remove(idx)}
                    className="ease focus:shadow-outline rounded-md border border-red-500 bg-red-500 px-4 py-2 text-white transition duration-500 select-none hover:bg-red-600 focus:outline-none"
                  >
                    DELETE
                  </Button>
                </div>
              )
            })}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter your message" className="h-24 resize-y" {...field} />
                </FormControl>
                <FormDescription>This is a summary of what the project is about.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}
