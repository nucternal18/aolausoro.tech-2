"use client";

// Components
import Table from "@app/protected/admin/projects/project-table";
import Loader from "@components/loader";
import { AddProjectForm } from "./add-project-form";
import Header from "@components/header";

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
    <section className="w-full p-4">
      <div className="items-center flex justify-between w-full mb-4 overflow-hidden">
        <Header title="Projects" order={1} />
        <AddProjectForm />
      </div>
      <Table projects={(projects as PartialProjectProps[]) || []} />
    </section>
  );
}
