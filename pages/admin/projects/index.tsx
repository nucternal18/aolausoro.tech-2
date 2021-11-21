import React from "react";
import AdminLayout from "components/AdminLayout";
import Table from "components/Table";
import Table2 from "components/Table2";

import { usePortfolio } from "context/portfolioContext";

function Projects() {
  const { state } = usePortfolio();
  return (
    <AdminLayout title="">
      <section className=" h-screen   py-10 md:px-8">
        {state.projects && <Table2 data={state.projects} />}
      </section>
    </AdminLayout>
  );
}

export default Projects;
