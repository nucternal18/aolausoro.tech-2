import { EditProject } from "./edit-project";

function project({ params }: { params: { id: string } }) {
  return (
    <section className="flex items-center w-full h-screen p-4 overflow-y-auto  ">
      <EditProject id={params.id} />
    </section>
  );
}

export default project;
