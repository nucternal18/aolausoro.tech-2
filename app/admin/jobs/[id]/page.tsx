"use client";
import EditJobComponent from "components/forms/EditJobComponent";

// redux
import { useGetJobsQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";
import Loader from "components/Loader";

function Job() {
  const { data: job, isLoading } = useGetJobsQuery({ status: "all" });

  if (isLoading) {
    return (
      <section className="flex items-center justify-center w-full h-full">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center w-full h-full">
      <EditJobComponent job={job} />
    </section>
  );
}

export default Job;
