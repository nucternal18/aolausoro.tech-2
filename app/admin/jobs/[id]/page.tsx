"use client";
import EditJobComponent from "components/forms/EditJobComponent";

// redux
import { useGetJobByIdQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";
import Loader from "components/Loader";

function Job({ param }: { param: { id: string } }) {
  const { id } = param;
  const { data: job, isLoading } = useGetJobByIdQuery(id);

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
