"use client";

import { useRouter } from "next/navigation";

// Components
import Loader from "@components/Loader";
import { Button } from "@components/ui/button";
import { EditProjectForm } from "../edit-project-form";

// controller
import useProjectController from "../use-project-controller";
import type { PartialProjectProps } from "schema/Project";

export function EditProject({ id }: { id: string }) {
  const router = useRouter();
  const { project, isLoadingProject } = useProjectController(id);

  if (isLoadingProject) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <section className="flex items-center w-full p-4">
      <div className="items-center w-full p-6 mt-20 mb-4 overflow-hidden rounded shadow-lg dark:shadow-none ">
        <div className="flex items-center justify-between border-b-2 mb-4 pb-2">
          <h3 className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
            Update project
          </h3>
          <Button type="button" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
        <EditProjectForm project={project as PartialProjectProps} />
      </div>
    </section>
  );
}
