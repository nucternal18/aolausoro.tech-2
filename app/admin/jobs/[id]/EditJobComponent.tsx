"use client";
import React from "react";

// redux
import { useAppSelector } from "@app/GlobalReduxStore/hooks";
import { jobSelector } from "@app/GlobalReduxStore/features/jobs/jobsSlice";

// components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

// zod schema
import type { PartialJobProps } from "schema/Job";

// controller
import useJobsController from "../use-jobs-controller";

const EditJobComponent = ({ job }: { job: PartialJobProps }) => {
  const state = useAppSelector(jobSelector);

  const defaultValues = {
    position: job?.position,
    company: job?.company,
    jobLocation: job?.jobLocation,
    jobType: job?.jobType,
    status: job?.status,
  };

  const { form, editJobHandler } = useJobsController();

  React.useEffect(() => {
    form.reset({ ...defaultValues });
  }, [job]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(editJobHandler)} className="space-y-8">
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter a position" {...field} />
              </FormControl>
              <FormDescription>
                This is the position you applied for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Enter a company name" {...field} />
              </FormControl>
              <FormDescription>
                This is the company you applied to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter a position" {...field} />
              </FormControl>
              <FormDescription>This is the location of the job</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Job status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {state.statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                This is the current status of the job application
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>aJob Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Job type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {state.jobTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                This is the type of job you applied for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default EditJobComponent;
