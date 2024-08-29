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
import { Typography } from "../../../../components/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";

// redux
import { useAppSelector } from "@app/global-redux-store/hooks";
import { jobSelector } from "@app/global-redux-store/features/jobs/jobsSlice";

// controller
import useJobsController from "./use-jobs-controller";

const SearchForm = () => {
  const state = useAppSelector(jobSelector);

  const { form } = useJobsController();

  return (
    <Card className="w-full sm:mx-0 container md:max-w-screen-md mx-1">
      <CardTitle>
        <CardHeader>
          <Typography variant="h3" className="text-primary capitalize">
            Search Jobs
          </Typography>
        </CardHeader>
      </CardTitle>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-2 md:gap-4 ">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary/50">Job Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-primary">
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
                  <FormLabel className="text-primary/50">Job Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-primary">
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
                  <FormLabel className="text-primary/50">SortBy</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="text-primary">
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
              className="w-full md:w-auto"
              onClick={(e) => {
                e.preventDefault();
                form.reset();
              }}
            >
              Reset
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
