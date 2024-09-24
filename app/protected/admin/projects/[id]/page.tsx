import { getProjectById } from "@app/actions/projects";
import { EditProject } from "./edit-project";
import { Suspense } from "react";
import Loader from "@components/Loader";

export default async function Page({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);
  return (
    <section className="flex items-center w-full h-screen py-4 overflow-y-auto px-11  ">
      <Suspense fallback={<Loader classes="w-8 h-8" />}>
        {"message" in project ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-lg font-semibold">
              {project.message ?? "No project found"}
            </div>
          </div>
        ) : (
          <EditProject project={project} />
        )}
      </Suspense>
    </section>
  );
}
