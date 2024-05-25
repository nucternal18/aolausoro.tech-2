import { ProjectsComponent } from "./projects";
import Header from "@components/header";

function ProjectsPage() {
  return (
    <section className="w-full h-screen p-4 overflow-y-auto">
      <ProjectsComponent />
    </section>
  );
}

export default ProjectsPage;
