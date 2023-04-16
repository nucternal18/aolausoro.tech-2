"use client";
import { useRouter } from "next/navigation";

// redux
import { useGetProjectByIdQuery } from "app/GlobalReduxStore/features/projects/projectApiSlice";
import Loader from "components/Loader";
import ProjectForm from "components/forms/ProjectForm";
import { Button } from "components";

function project({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    data: project,
    refetch,
    isLoading,
  } = useGetProjectByIdQuery(params.id);

  if (isLoading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }

  return (
    <section className="flex items-center w-full h-screen px-4 mx-auto mt-20 ">
      <div className="items-center w-full p-6 my-4 overflow-hidden rounded shadow-lg dark:shadow-none md:mx-auto">
        <div className="flex items-center justify-between border-b-2 mb-4 pb-2">
          <h3 className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
            Update project
          </h3>
          <Button
            type="button"
            color="dark"
            onClick={() => router.push("/admin/projects")}
          >
            Go back
          </Button>
        </div>
        <ProjectForm project={project} refetch={refetch} />
      </div>
    </section>
  );
}

export default project;
