// Components
import SearchForm from "@app/(protected)/admin/jobs/search-form";
import { JobsContainer } from "@app/(protected)/admin/jobs/Jobs";
import AddJobComponent from "./AddJobComponent";
import Header from "@components/header";

function Jobs() {
  return (
    <section className="container max-w-screen-xl flex-grow w-full px-2 py-4 mx-auto ">
      <section className="flex items-center justify-between w-full mb-4">
        <Header title="Jobs" order={1} />
        <AddJobComponent />
      </section>
      <SearchForm />
      <JobsContainer />
    </section>
  );
}

export default Jobs;
