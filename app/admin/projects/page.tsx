// Components
import Table from "components/Table/ProjectTable";
import Loader from "components/Loader";

// redux
import { useGetProjectsQuery } from "app/GlobalReduxStore/features/projects/projectApiSlice";
import { ProjectProps } from "lib/types";

function Projects() {
  const { data: projects, isLoading, isFetching } = useGetProjectsQuery();

  if (isFetching) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }
  return (
    <section className="w-full h-full py-10 md:px-8">
      <Table data={(projects as ProjectProps[]) || []} />
    </section>
  );
}

export default Projects;
