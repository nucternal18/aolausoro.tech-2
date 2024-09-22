import React from "react";
import { Suspense } from "react";
import { FaGithub, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Loader from "../../../components/Loader";

// components
import PortfolioCard from "@components/portfolio-card";
import { Button } from "@components/ui/button";
import type { PartialProjectProps } from "@src/entities/models/Project";

export default function PortfolioComponent({
  projects,
}: {
  projects: PartialProjectProps[];
}) {
  const publishedProjects = projects?.filter((doc) => doc.published);
  return (
    <>
      <section className="max-w-screen-lg mx-auto mb-4 px-4 lg:px-0">
        <div className="relative flex items-center justify-between mb-6 border-b border-primary">
          <h1 className="my-4 text-2xl md:text-5xl font-thin text-center">
            PORTFOLIO
          </h1>
          <Button variant="outline" className="border-primary" asChild>
            <Link
              href="https://github.com/nucternal18?tab=repositories"
              className="px-2 py-2 flex items-center font-semibold  gap-1"
            >
              <FaGithub />
              <span className="text-xs sm:text-md md:text-lg">View GitHub</span>
              <FaChevronRight />
            </Link>
          </Button>
        </div>

        <h2 className="text-2xl text-center text-black dark:text-gray-100 my-4">
          Some of my projects
        </h2>
      </section>
      <section className="relative max-w-screen-lg mx-auto px-4 lg:px-0 mb-4">
        <Suspense>
          <div className="grid grid-cols-1 gap-3  my-4 sm:grid-cols-2 md:grid-cols-3 sm:px-0">
            {publishedProjects &&
              publishedProjects?.map((doc) => (
                <PortfolioCard key={doc.id} project={doc} />
              ))}
          </div>
        </Suspense>
      </section>
    </>
  );
}
