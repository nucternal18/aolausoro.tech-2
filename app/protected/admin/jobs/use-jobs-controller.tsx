"use client";

import { use, useCallback, useEffect } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// redux
import { useAppSelector } from "@app/global-redux-store/hooks";
import { jobSelector } from "@app/global-redux-store/features/jobs/jobsSlice";

// components
import { useToast } from "@components/ui/use-toast";
import {
  partialJobSchema,
  type PartialJobProps,
} from "@src/entities/models/Job";
import { createJob, deleteJob, updateJob } from "@app/actions/jobs";

/**
 * Custom hook for managing jobs data and operations.
 *
 * @param id - The ID of the job.
 * @param setOpen - Optional state setter for controlling the open state of a component.
 * @returns An object containing jobs data, job data, loading states, form instance, and various handlers.
 */
export default function useJobsController(
  jobId?: string,
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

  /**
   * Handles the creation of a job.
   *
   * @param {PartialJobProps} data - The data for the job to be created.
   * @returns {Promise<void>} - A promise that resolves when the job creation is complete.
   */
  const createJobHandler: SubmitHandler<PartialJobProps> = useCallback(
    async (data) => {
      const jobFormData = new FormData();
      jobFormData.append("position", data.position as string);
      jobFormData.append("company", data.company as string);
      jobFormData.append("jobLocation", data.jobLocation as string);
      jobFormData.append("jobType", data.jobType as string);
      jobFormData.append("status", data.status as string);
      jobFormData.append("search", data.search as string);
      jobFormData.append("sort", data.sort as string);

      try {
        const response = await createJob(jobFormData);

        if (response.success) {
          setOpen && setOpen(false);
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
      const jobFormData = new FormData();
      jobFormData.append("id", jobId as string);
      jobFormData.append("position", data.position as string);
      jobFormData.append("company", data.company as string);
      jobFormData.append("jobLocation", data.jobLocation as string);
      jobFormData.append("jobType", data.jobType as string);
      jobFormData.append("status", data.status as string);
      jobFormData.append("search", data.search as string);
      jobFormData.append("sort", data.sort as string);

      try {
        const response = await updateJob(jobFormData);

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
    [jobId],
  );

  /**
   * Handles the deletion of a job.
   *
   * @param {string} id - The ID of the job to be deleted.
   * @returns {Promise<void>} - A promise that resolves when the job is successfully deleted.
   */
  const deleteJobHandler = useCallback(async (id: string) => {
    try {
      const response = await deleteJob(id);

      if (response.success) {
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
    form,
    createJobHandler,
    editJobHandler,
    deleteJobHandler,
  };
}
