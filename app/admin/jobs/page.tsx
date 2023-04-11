"use client";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import { JobsContainer, SearchForm } from "components";
import { NEXT_URL } from "config";

// redux
import { useAppSelector } from "app/GlobalReduxStore/hooks";
import { jobSelector } from "app/GlobalReduxStore/features/jobs/jobsSlice";
import { useGetJobsQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";
import { JobsProps } from "lib/types";
interface IFormData {
  search: string;
  company: string;
  sort: string;
  sortOptions: string[];
  jobType: string;
  jobTypeOptions: string[];
  status: string;
  statusOptions: string[];
}

function Jobs() {
  const state = useAppSelector(jobSelector);

  const {
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      search: "",
      status: state.searchStatus,
      jobType: state.searchType,
      sort: state.sort,
    },
  });

  const { search, status, jobType, sort } = watch();
  const {
    data: jobs,
    isLoading,
    refetch,
  } = useGetJobsQuery({
    status: status,
    page: state.page.toString(),
    sort: sort,
    jobType: jobType,
    search: search,
  });

  return (
    <div className="md:p-4">
      <SearchForm register={register} reset={reset} errors={errors} />
      <JobsContainer jobs={jobs as JobsProps} isLoading={isLoading} />
    </div>
  );
}

export default Jobs;
