import { Suspense } from "react";
// component
import Header from "@components/header";
import EditJobComponent from "./EditJobComponent";
import { Button } from "@components/ui/button";
import Loader from "../../../../../components/Loader";
import type { PartialJobProps } from "@src/entities/models/Job";
import { getJobById } from "@app/actions/jobs";

// redux

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const job = await getJobById(id);
  return (
    <section className="w-full p-4 min-h-screen container mx-auto">
      <section className="flex items-center justify-between mb-4 w-full">
        <Header title="Edit Job" order={1} />
        <Button
          variant={"outline"}
          className="w-ful sm:w-1/3 md:w-1/4 text-primary border-primary"
        >
          Go Back
        </Button>
      </section>
      <Suspense fallback={<Loader classes="w-8 h-8" />}>
        <EditJobComponent job={job} />
      </Suspense>
    </section>
  );
}
