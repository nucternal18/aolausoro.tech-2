import { getProjects } from "@app/actions/projects";
import Loader from "@components/Loader";
import PortfolioComponent from "./portfolio-component";
import { Suspense } from "react";

export default async function Page() {
  const data = await getProjects();

  return (
    <section className="h-screen py-4 text-primary">
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-full">
            <Loader classes="h-8 w-8" />
          </div>
        }
      >
        <PortfolioComponent projects={data} />
      </Suspense>
    </section>
  );
}
