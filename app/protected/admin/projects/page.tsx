import { ProjectsComponent } from "./projects";
import Header from "@components/header";

function ProjectsPage() {
  return (
    <section className="container flex-grow w-full h-screen p-2 sm:p-6 space-y-4  mx-auto">
      <ProjectsComponent />
    </section>
  );
}

export default ProjectsPage;
