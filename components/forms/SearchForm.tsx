import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { useGlobalApp } from "context/appContext";
import FormRowSelect from "../FormRowSelect";
import FormRowInput from "../FormRowInput";
import { useEffect } from "react";
import { NEXT_URL } from "config";

interface IFormData {
  search: string;
  company: string;
  sort: string;
  sortOptions: string[];
  jobType: string;
  jobTypeOptions: string[];
  status: string;
  statusOptions: string[];
}

const SearchForm = ({ register, reset, errors }) => {
  const { state } = useGlobalApp();

  return (
    <form>
      <div className="relative p-2  max-w-screen-xl  bg-white font-mono dark:bg-gray-900 shadow-xl mt-5 mx-2 md:p-4">
        <h3 className="capitalize text-xl font-semibold  text-gray-900 dark:text-gray-200 mb-4">
          search form
        </h3>
        <div className="flex flex-col gap-2 md:flex-row">
          <FormRowInput
            title="Search"
            name="search"
            inputType="text"
            type="search"
            register={register}
            errors={errors.search}
          />

          <FormRowSelect
            name="Status"
            type="status"
            register={register}
            errors={errors.status}
            list={["all", ...state.job.statusOptions]}
          />
          <FormRowSelect
            name="Job Type"
            type="jobType"
            register={register}
            errors={errors.jobType}
            list={["all", ...state.job.jobTypeOptions]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
          <FormRowSelect
            name="Sort"
            type="sort"
            register={register}
            errors={errors.sort}
            list={state.job.sortOptions}
          />

          <button
            className=" px-4 py-2 font-bold mt-4 text-white w-full bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline  dark:text-gray-200 dark:hover:bg-gray-400"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              reset();
            }}
          >
            clear
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
