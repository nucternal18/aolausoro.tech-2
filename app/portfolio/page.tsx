"use client";
import { Suspense } from "react";
import { FaGithub, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import Loader from "components/Loader";
// redux
import { useGetProjectsQuery } from "../GlobalReduxStore/features/projects/projectApiSlice";

// components
import PortfolioCard from "components/PortfolioCard";

const Portfolio = () => {
  const { data: projects, isLoading } = useGetProjectsQuery();
  const publishedProjects = projects?.filter((doc) => doc.published);

  if (isLoading)
    return (
      <section className="max-w-screen-lg mx-auto mb-4 h-screen px-4 lg:px-0">
        <div className="flex items-center justify-center h-full">
          <Loader classes="h-8 w-8" />
        </div>
      </section>
    );

  return (
    <section className="h-screen py-4">
      <section className="max-w-screen-lg mx-auto mb-4 px-4 lg:px-0">
        <div className="relative flex items-center justify-between mb-6 border-b border-current dark:border-yellow-500">
          <h1 className="my-4 text-2xl md:text-5xl font-thin text-center text-black dark:text-yellow-500">
            PORTFOLIO
          </h1>
          <Link
            href="https://github.com/nucternal18?tab=repositories"
            className="px-2 py-2 flex items-center font-semibold text-gray-700 bg-transparent border gap-1 border-gray-500 rounded hover:text-white dark:text-yellow-500 dark:border-yellow-500 hover:bg-gray-500 dark:hover:bg-yellow-500 dark:hover:text-white hover:border-transparent"
          >
            <FaGithub />
            <span className="text-xs sm:text-md md:text-lg">View GitHub</span>
            <FaChevronRight />
          </Link>
        </div>

        <h2 className="text-2xl text-center text-black dark:text-gray-100 my-4">
          Some of my projects
        </h2>
      </section>
      <section className="relative max-w-screen-lg mx-auto px-4 lg:px-0 mb-4">
        <Suspense>
          <div className="grid grid-cols-1 gap-3 px-4 my-4 sm:grid-cols-2 md:grid-cols-3 sm:px-0">
            {projects &&
              publishedProjects?.map((doc) => (
                <PortfolioCard key={doc.id} doc={doc} />
              ))}
          </div>
        </Suspense>
      </section>
    </section>
  );
};

export default Portfolio;
