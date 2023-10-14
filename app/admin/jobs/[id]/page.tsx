"use client";
// component
import EditJobComponent from "./EditJobComponent";

// redux
import { useGetJobByIdQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";
import Loader from "components/Loader";
import type { PartialJobProps } from "schema/Job";

function Job({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: job, isLoading } = useGetJobByIdQuery(id);

  if (isLoading) {
    return (
      <section className="flex items-center justify-center w-full h-full">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <section className="flex w-full p-4 min-h-screen">
      <section className="flex items-center justify-between mb-4">
        <h3 className="capitalize text-xl font-semibold  text-gray-900 dark:text-gray-200">
          Edit Job
        </h3>
      </section>
      <div className="container mx-auto">
        <EditJobComponent job={job as PartialJobProps} />
      </div>
    </section>
  );
}

export default Job;
