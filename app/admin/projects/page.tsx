"use client";
// Components
import Table from "components/Table/ProjectTable";
import Loader from "components/Loader";

// redux
import { useGetProjectsQuery } from "../../GlobalReduxStore/features/projects/projectApiSlice";
import { ProjectProps } from "lib/types";
import ProjectForm from "components/forms/ProjectForm";

function Projects() {
  const { data: projects, isFetching, refetch } = useGetProjectsQuery();

  if (isFetching) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }
  return (
    <section className="w-full h-screen p-4 overflow-y-auto">
      <div className="items-center w-full my-4 overflow-hidden rounded shadow-lg dark:shadow-none md:mx-auto p-2">
        <div className="flex items-center justify-between border-b-2 border-gray-900 dark:border-yellow-500 mb-4 p-2">
          <h3 className="mb-2 text-2xl font-bold md:text-4xl text-gray-900 dark:text-yellow-500">
            Create project
          </h3>
        </div>
        <ProjectForm refetch={refetch} />
      </div>
      <Table data={(projects as ProjectProps[]) || []} />
    </section>
  );
}

export default Projects;
