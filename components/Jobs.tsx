import { JobsProps } from "types/types";
import { JobCard, PageBtnContainer, Spinner } from ".";

interface JobsContainerProps {
  jobs: JobsProps;
  isLoading: boolean;
}
const JobsContainer: React.FC<JobsContainerProps> = ({
  jobs,
  isLoading,
}: JobsContainerProps): JSX.Element => {
  const { jobs: jobsArr, totalJobs, numberOfPages } = jobs;

  if (isLoading) {
    <Spinner message="Loading Jobs..." />;
  }

  if (jobsArr.length === 0) {
    return <div>No jobs to display</div>;
  }

  return (
    <div className="mt-5 text-gray-900 dark:text-gray-200 max-w-screen-2xl mx-1 sm:mx-auto ">
      <h5 className="text-2xl font-semibold font-mono capitalize ml-1 ">
        {totalJobs} job{jobsArr.length > 1 && "s"} found
      </h5>
      <div className=" grid grid-cols-1 sm:grid-cols-2  gap-2 my-5 ">
        {jobsArr.map((job) => (
          <JobCard key={job.id} {...job} />
        ))}
      </div>
      {numberOfPages > 1 && (
        <PageBtnContainer numberOfPages={jobs.numberOfPages} />
      )}
      <PageBtnContainer numberOfPages={numberOfPages} />
    </div>
  );
};

export default JobsContainer;
