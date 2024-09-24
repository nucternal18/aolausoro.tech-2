"use client";

// Components
import Table from "@app/protected/admin/projects/project-table";
import Loader from "@components/Loader";
import { AddProjectForm } from "./add-project-form";
import Header from "@components/header";

// controller
import useProjectController from "./use-project-controller";
import type { PartialProjectProps } from "@src/entities/models/Project";

export function ProjectsComponent({
  projects,
}: {
  projects: PartialProjectProps[];
}) {
  return (
    <section className="w-full p-4">
      <div className="items-center flex justify-between w-full mb-4 overflow-hidden">
        <Header title="Projects" order={1} />
        <AddProjectForm />
      </div>
      <Table projects={projects} />
    </section>
  );
}
