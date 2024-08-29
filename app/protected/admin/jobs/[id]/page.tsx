"use client";

import { useRouter } from "next/navigation";
// component
import Header from "@components/header";
import EditJobComponent from "./EditJobComponent";
import { Button } from "@components/ui/button";
import Loader from "@components/loader";

// redux
import { useGetJobByIdQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";

// zod schema
import type { PartialJobProps } from "schema/Job";

function Job({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: job, isLoading } = useGetJobByIdQuery(id);

  if (isLoading) {
    return (
      <section className="flex items-center justify-center w-full h-full">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <section className="w-full p-4 min-h-screen container mx-auto">
      <section className="flex items-center justify-between mb-4 w-full">
        <Header title="Edit Job" order={1} />
        <Button
          variant={"outline"}
          className="w-ful sm:w-1/3 md:w-1/4 text-primary border-primary"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </section>

      <EditJobComponent job={job as PartialJobProps} />
    </section>
  );
}

export default Job;
