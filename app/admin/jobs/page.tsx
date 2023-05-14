"use client";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { JobsContainer, SearchForm } from "components";

// redux
import { useAppSelector } from "app/GlobalReduxStore/hooks";
import { jobSelector } from "app/GlobalReduxStore/features/jobs/jobsSlice";
import { useGetJobsQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";
import { JobsProps } from "types/types";

// Components
import Loader from "components/Loader";

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
  const { status: authStatus } = useSession();
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

  if (status === "unauthenticated") {
    return redirect("/auth/login");
  }

  if (isLoading) {
    return (
      <section className="flex items-center justify-center w-full h-full">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <div className="md:p-4">
      <SearchForm register={register} reset={reset} errors={errors} />
      <JobsContainer jobs={jobs as JobsProps} isLoading={isLoading} />
    </div>
  );
}

export default Jobs;
