"use client";

import { useCallback } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// redux
import { useAppSelector } from "@app/GlobalReduxStore/hooks";
import { jobSelector } from "@app/GlobalReduxStore/features/jobs/jobsSlice";
import {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@app/GlobalReduxStore/features/jobs/jobsApiSlice";
import { partialJobSchema, type PartialJobProps } from "schema/Job";

// components
import { useToast } from "@components/ui/use-toast";

export default function useJobsController(
  id?: string,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const router = useRouter();
  const state = useAppSelector(jobSelector);
  const { toast } = useToast();

  const form = useForm<PartialJobProps>({
    resolver: zodResolver(partialJobSchema),
    defaultValues: {
      position: "",
      company: "",
      jobLocation: "",
      jobType: "full-time",
      status: "pending",
      search: "",
      sort: "asc",
    },
  });

  const { search, status, jobType, sort } = form.watch();

  // get jobs
  const {
    data: jobs,
    isLoading: isLoadingJobs,
    refetch,
  } = useGetJobsQuery(
    {
      status: status,
      page: state.page.toString(),
      sort: sort,
      jobType: jobType,
      search: search,
    },
    {
      skip: id ? true : false,
    },
  );

  // get job by id
  const { data: job, isLoading: isLoadingJob } = useGetJobByIdQuery(
    id as string,
    {
      skip: !id,
    },
  );

  // job mutations
  const [addJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading }] = useUpdateJobMutation();

  const createJobHandler: SubmitHandler<PartialJobProps> = useCallback(
    async (data) => {
      try {
        const response = await addJob(data).unwrap();

        if (response.success) {
          setOpen && setOpen(false);
          refetch();
          toast({
            title: "Success!!",
            description: response.message,
          });
        }
      } catch (error) {
        toast({
          title: "Error!!",
          description: "Error creating job",
        });
      }
    },
    [],
  );

  const editJobHandler: SubmitHandler<PartialJobProps> = useCallback(
    async (data) => {
      const jobData = {
        id: job?.id,
        ...data,
      };
      try {
        const response = await updateJob(jobData).unwrap();

        if (response.success) {
          toast({
            title: "Success!!",
            description: response.message,
          });
          router.push("/admin/jobs");
        }
      } catch (error) {
        toast({
          title: "Error!!",
          description: "Error updating job",
        });
      }
    },
    [],
  );

  return {
    jobs,
    job,
    isLoadingJobs,
    isLoadingJob,
    form,
    createJobHandler,
    editJobHandler,
  };
}
