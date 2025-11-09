import { getProjectById } from "@app/actions/projects";
import { EditProject } from "./edit-project";
import { Suspense } from "react";
import Loader from "@components/Loader";

export default async function Page({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);
  return (
    <section className="flex items-center w-full h-screen py-4 overflow-y-auto px-11  ">
      <Suspense fallback={<Loader classes="w-8 h-8" />}>
        <EditProject project={project} />
      </Suspense>
    </section>
  );
}
