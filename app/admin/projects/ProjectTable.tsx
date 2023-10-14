// components
import { DataTable } from "@components/data-table/data-table";
import { columns } from "./table-columns";

// zod schema
import type { PartialProjectProps } from "schema/Project";

function Table({ projects }: { projects: PartialProjectProps[] }) {
  return (
    <>
      <DataTable columns={columns} data={projects} name="projects" />
    </>
  );
}

export default Table;
