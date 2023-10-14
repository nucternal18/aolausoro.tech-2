import Link from "next/link";
import type { PartialProjectProps } from "schema/Project";

export const GithubRepoCard = ({
  project,
}: {
  project: PartialProjectProps;
}) => {
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        {project.projectName}
      </h1>
      <p className="my-4 text-base font-normal text-gray-500">
        {project.description}
      </p>
      <a
        href={project.github as string}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-row items-center w-full mx-auto space-x-2 font-semibold group"
      >
        <p>View Repository </p>
        <span className="transition duration-300 transform group-hover:translate-x-2">
          &rarr;
        </span>
      </a>
    </div>
  );
};
