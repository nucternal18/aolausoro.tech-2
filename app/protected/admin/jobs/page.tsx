// Components
import SearchForm from "@app/protected/admin/jobs/search-form";
import { JobsContainer } from "@app/protected/admin/jobs/Jobs";
import AddJobComponent from "./AddJobComponent";
import Header from "@components/header";

function Jobs() {
  return (
    <section className="w-full min-h-screen container mx-auto py-4  ">
      <section className="flex container items-center mx-auto justify-between w-full mb-4">
        <Header title="Jobs" order={1} />
        <AddJobComponent />
      </section>
      <section className="w-full">
        <SearchForm />
        <JobsContainer />
      </section>
    </section>
  );
}

export default Jobs;
