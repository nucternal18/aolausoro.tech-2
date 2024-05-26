"use client";

import { use, useCallback, useEffect } from "react";
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

/**
 * Custom hook for managing jobs data and operations.
 *
 * @param id - The ID of the job.
 * @param setOpen - Optional state setter for controlling the open state of a component.
 * @returns An object containing jobs data, job data, loading states, form instance, and various handlers.
 */
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
      jobType: "all",
      status: "all",
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
  } = useGetJobsQuery({
    status: status,
    page: state.page.toString(),
    sort: sort,
    jobType: jobType,
    search: search,
  });

  useEffect(() => {
    if (status) {
      refetch();
    }
  }, [search, status, jobType, sort]);

  // get job by id
  const { data: job, isLoading: isLoadingJob } = useGetJobByIdQuery(
    id as string,
    {
      skip: !id,
    },
  );

  // job mutations
  const [addJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  /**
   * Handles the creation of a job.
   *
   * @param {PartialJobProps} data - The data for the job to be created.
   * @returns {Promise<void>} - A promise that resolves when the job creation is complete.
   */
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

  /**
   * Handles the submission of edited job data.
   *
   * @param data - The partial job data to be updated.
   */
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

  /**
   * Handles the deletion of a job.
   *
   * @param {string} id - The ID of the job to be deleted.
   * @returns {Promise<void>} - A promise that resolves when the job is successfully deleted.
   */
  const deleteJobHandler = useCallback(async (id: string) => {
    try {
      const response = await deleteJob(id).unwrap();

      if (response.success) {
        refetch();
        toast({
          title: "Success!! Job deleted.",
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        title: "Error!!",
        description: "Error deleting job",
      });
    }
  }, []);

  return {
    jobs,
    job,
    isLoadingJobs,
    isLoadingJob,
    isCreating,
    isUpdating,
    isDeleting,
    form,
    createJobHandler,
    editJobHandler,
    deleteJobHandler,
  };
}
