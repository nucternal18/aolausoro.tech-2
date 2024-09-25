import { Suspense } from "react";
import { getProjects } from "@app/actions/projects";
import { ProjectsComponent } from "./projects";
import Loader from "@components/Loader";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <section className="container flex-grow w-full h-screen p-2 sm:p-6 space-y-4  mx-auto">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <Loader classes="w-8 h-8" />
          </div>
        }
      >
        <ProjectsComponent projects={projects} />
      </Suspense>
    </section>
  );
}
