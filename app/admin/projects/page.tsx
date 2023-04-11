// Components
import Table from "components/Table/ProjectTable";
import Loader from "components/Loader";

// redux
import {
  useGetProjectByIdQuery,
  useGetProjectsQuery,
} from "app/GlobalReduxStore/features/projects/projectApiSlice";

function Projects() {
  const { data: projects, isLoading } = useGetProjectsQuery();

  if (isLoading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <Loader classes="w-8 h-8" />
      </section>
    );
  }
  return (
    <section className="w-full h-full py-10 md:px-8">
      <Table data={projects} />
    </section>
  );
}

export default Projects;
