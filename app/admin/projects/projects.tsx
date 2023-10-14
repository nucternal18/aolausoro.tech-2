"use client";

// Components
import Table from "@app/admin/projects/ProjectTable";
import Loader from "components/Loader";
import { AddProjectForm } from "./add-project-form";

// controller
import useProjectController from "./use-project-controller";
import type { PartialProjectProps } from "schema/Project";

export function ProjectsComponent() {
  const { projects, isLoading } = useProjectController();

  if (isLoading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }
  return (
    <section className="w-full">
      <div className="items-center w-full mb-4 overflow-hidden rounded shadow-lg dark:shadow-none md:mx-auto">
        <AddProjectForm />
      </div>
      <Table projects={(projects as PartialProjectProps[]) || []} />
    </section>
  );
}
