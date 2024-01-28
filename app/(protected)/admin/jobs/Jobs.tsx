"use client";

// components
import { JobCard } from "./Job";
import PageBtnContainer from "@components/PageBtnContainer";
import Loader from "@components/Loader";

// zod schema
import type { PartialJobProps } from "schema/Job";

// controller
import useJobsController from "./use-jobs-controller";

export function JobsContainer() {
  const { jobs, isLoadingJobs } = useJobsController();
  console.log("🚀 ~ JobsContainer ~ jobs:", jobs);
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
    <div className="mt-5 text-gray-900 dark:text-gray-200 max-w-screen-2xl mx-1 sm:mx-auto ">
      <h5 className="text-2xl font-semibold font-mono capitalize ml-1 ">
        {totalJobs} job{jobsArr ? jobsArr?.length > 1 && "s" : null} found
      </h5>
      <div className=" grid grid-cols-1 sm:grid-cols-2  gap-2 my-5 ">
        {jobsArr?.map((job) => <JobCard key={job.id} job={job} />)}
      </div>
      {numberOfPages > 1 && <PageBtnContainer numberOfPages={numberOfPages} />}
      <PageBtnContainer numberOfPages={numberOfPages} />
    </div>
  );
}
