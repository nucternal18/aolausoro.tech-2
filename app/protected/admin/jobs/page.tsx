// Components
import SearchForm from "@app/protected/admin/jobs/search-form";
import { JobsContainer } from "@app/protected/admin/jobs/Jobs";
import AddJobComponent from "./add-job-component";
import Header from "@components/header";
import { getJobs } from "@app/actions/jobs";
import type { JobsProps } from "@src/entities/models/Job";
import { Suspense } from "react";
import Loader from "@components/Loader";

export default async function Jobs() {
  const jobs = await getJobs({});
  return (
    <section className="w-full min-h-screen container mx-auto py-4  ">
      <section className="flex container items-center mx-auto justify-between w-full mb-4">
        <Header title="Jobs" order={1} />
        <AddJobComponent />
      </section>
      <section className="w-full">
        <SearchForm />
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <Loader classes="w-8 h-8" />
            </div>
          }
        >
          {Array.isArray(jobs) ? (
            <JobsContainer jobs={jobs as JobsProps} />
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div className="text-lg font-semibold">
                {"message" in jobs ? jobs.message : "No jobs found"}
              </div>
            </div>
          )}
        </Suspense>
      </section>
    </section>
  );
}
