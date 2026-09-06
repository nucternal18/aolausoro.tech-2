'use client'

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

import useUserController from './use-user-controller'
import PDFFileInput from '@components/file-uploader/pdf-file-input'
import { Progress } from '@components/ui/progress'
import type { PartialUserProps } from '@src/entities/models/User'

interface IUserProfile {
  user: PartialUserProps
}

export function ProfileComponent({ user }: IUserProfile) {
  const { form, uploadPDF, progress } = useUserController()

  return (
    <section className="relative container mx-auto h-full items-center justify-center pb-2">
      <div className="flex flex-col pb-5">
        <div className="relative mb-7 flex-col space-y-8">
          <div className="flex flex-col items-center justify-center">
            <img
              className="h-[300px] w-full object-cover shadow-lg"
              src={'/images/rahul-mishra-unsplash.jpg'}
              alt="banner-pic"
            />
            <img
              src={user?.image}
              alt="user-pic"
              className="-mt-10 h-20 w-20 rounded-full object-cover shadow-xl"
            />
            <h1 className="mt-3 text-center text-3xl font-bold">{user?.name}</h1>
          </div>

          <div className="space-y-8 px-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(uploadPDF)} className="space-y-8">
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
                <Button type="submit">Submit</Button>
              </form>
            </Form>
            <Progress value={progress} />
          </div>
        </div>
      </div>
    </section>
  )
}
