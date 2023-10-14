// Components
import SearchForm from "@app/admin/jobs/search-form";
import { JobsContainer } from "@app/admin/jobs/Jobs";
import AddJobComponent from "./AddJobComponent";

function Jobs() {
  return (
    <section className="container max-w-screen-xl flex-grow w-full h-screen px-2 mx-auto ">
      <section className="flex items-center justify-between w-full mb-4">
        <h3 className="capitalize text-xl font-semibold  text-gray-900 dark:text-gray-200">
          Jobs
        </h3>
        <AddJobComponent />
      </section>
      <SearchForm />
      <JobsContainer />
    </section>
  );
}

export default Jobs;
