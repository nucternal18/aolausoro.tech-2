"use client";

// components
import { JobCard } from "./job";
import PageBtnContainer from "@components/page-btn-container";
import Loader from "@components/loader";

// zod schema
import type { PartialJobProps } from "schema/Job";

// controller
import useJobsController from "./use-jobs-controller";
import { Typography } from "@components/Typography";

export function JobsContainer() {
  const { jobs, isLoadingJobs } = useJobsController();

  const jobsArr = jobs?.jobs as PartialJobProps[];
  const numberOfPages = jobs?.numberOfPages as number;
  const totalJobs = jobs?.totalJobs as number;

  if (isLoadingJobs) {
    <section className="flex items-center justify-center h-full">
      <Loader classes="w-8 h-8" />
    </section>;
  }

  if (jobsArr?.length === 0) {
    return <div>No jobs to display</div>;
  }

  return (
    <section className="mt-5 text-primary mx-1 sm:mx-0 ">
      <Typography variant="h4" className="text-primary">
        {totalJobs} job{jobsArr ? jobsArr?.length > 1 && "s" : null} found
      </Typography>

      {isLoadingJobs ? (
        <section className="flex items-center justify-center h-full">
          <Loader classes="w-8 h-8" />
        </section>
      ) : (
        <>
          <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-2 my-5 ">
            {jobsArr?.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
          <PageBtnContainer numberOfPages={numberOfPages} />
        </>
      )}
    </section>
  );
}
