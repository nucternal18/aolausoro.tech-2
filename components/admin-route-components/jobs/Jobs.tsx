"use client";

// components
import { JobCard } from "./Job";
import PageBtnContainer from "@components/page-btn-container";
import Loader from "@components/Loader";

// zod schema

// controller
import useJobsController from "./use-jobs-controller";
import { Typography } from "@components/Typography";
import type { JobsProps, PartialJobProps } from "@src/entities/models/Job";

export function JobsContainer({ jobs }: { jobs: JobsProps }) {
  const jobsArr = jobs?.jobs as PartialJobProps[];
  const numberOfPages = jobs?.numberOfPages;
  const totalJobs = jobs?.totalJobs;

  if (jobsArr?.length === 0) {
    return <div>No jobs to display</div>;
  }

  return (
    <section className="mt-5 text-primary mx-1 sm:mx-0 ">
      <Typography variant="h4" className="text-primary">
        {totalJobs} job{jobsArr ? jobsArr?.length > 1 && "s" : null} found
      </Typography>

      <div className=" grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3  gap-2 my-5 ">
        {jobsArr?.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
      <PageBtnContainer numberOfPages={numberOfPages} />
    </section>
  );
}
