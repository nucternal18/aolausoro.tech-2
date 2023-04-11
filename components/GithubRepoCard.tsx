import Link from "next/link";

export const GithubRepoCard = ({ latestRepo }) => {
  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
        {latestRepo.name}
      </h1>
      <p className="my-4 text-base font-normal text-gray-500">
        {latestRepo.description}
      </p>
      <Link
        href={latestRepo.clone_url}
        className="flex flex-row items-center w-full mx-auto space-x-2 font-semibold group"
      >
        <p>View Repository </p>
        <span className="transition duration-300 transform group-hover:translate-x-2">
          &rarr;
        </span>
      </Link>
    </div>
  );
};
