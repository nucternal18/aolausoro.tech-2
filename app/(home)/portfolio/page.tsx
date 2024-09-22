import { getProjects } from "@app/actions/projects";
import Loader from "@components/Loader";
import type { PartialProjectProps } from "@src/entities/models/Project";
import PortfolioComponent from "./portfolio-component";
import { Typography } from "@components/Typography";

export default async function Page() {
  const data = (await getProjects()) as PartialProjectProps[];

  return (
    <section className="h-screen py-4 text-primary">
      {Array.isArray(data) && data.length > 0 ? (
        <PortfolioComponent projects={data} />
      ) : (
        <div className="flex flex-col items-center space-y-4 justify-center h-full">
          <Loader classes="h-8 w-8" />
          <div className="text-2xl font-bold">
            Error: {JSON.stringify(data)}
          </div>
        </div>
      )}
    </section>
  );
}
