"use client";

// components
import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

// redux
import { useAppSelector } from "@app/GlobalReduxStore/hooks";
import { jobSelector } from "@app/GlobalReduxStore/features/jobs/jobsSlice";

// controller
import useJobsController from "./use-jobs-controller";

const SearchForm = () => {
  const state = useAppSelector(jobSelector);

  const { form } = useJobsController();

  return (
    <section className="relative p-2  max-w-screen-xl  bg-white font-mono dark:bg-gray-900 shadow-xl mt-5 mx-2 md:mx-auto md:p-4">
      <h3 className="capitalize text-xl font-semibold  text-gray-900 dark:text-gray-200 mb-4">
        search form
      </h3>
      <Form {...form}>
        <form className="flex w-full flex-col gap-2 md:flex-row">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Job status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {state.statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This is the current status of the job application
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>aJob Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {state.jobTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This is the type of job you applied for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SortBy</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {state.sortOptions.map((options) => (
                      <SelectItem key={options} value={options}>
                        {options}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  This is the type of job you applied for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              form.reset();
            }}
          >
            Reset
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default SearchForm;
