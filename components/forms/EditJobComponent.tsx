"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import FormRowSelect from "../FormRowSelect";
import FormRowInput from "../FormRowInput";

// redux
import { useAppSelector } from "app/GlobalReduxStore/hooks";
import { jobSelector } from "app/GlobalReduxStore/features/jobs/jobsSlice";
import { useUpdateJobMutation } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";

interface IFormData {
  position: string;
  company: string;
  jobLocation: string;
  jobType: string;
  jobTypeOptions: string[];
  status: string;
  statusOptions: string[];
}

const EditJobComponent = ({ job }) => {
  const router = useRouter();
  const state = useAppSelector(jobSelector);
  const [updateJob, { isLoading }] = useUpdateJobMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      position: job?.position,
      company: job?.company,
      jobLocation: job?.jobLocation,
      jobType: job?.jobType,
      status: job?.status,
    },
  });

  const onSubmit: SubmitHandler<IFormData> = React.useCallback(async (data) => {
    if (!data.position || !data.company || !data.jobLocation) {
      toast.error("Please fill out all fields");
      return;
    }
    const jobData = {
      id: job?.id,
      ...data,
    };
    try {
      const response = await updateJob(jobData).unwrap();

      if (response.success) {
        toast.success(state.message);
        router.push("/admin/jobs");
      }
    } catch (error) {
      toast.error("Error updating job", {
        autoClose: 2000,
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className=" p-2  max-w-screen-xl  bg-white font-mono dark:bg-gray-900 shadow-xl mt-5 mx-2 md:mx-auto md:p-4">
        <h3 className="capitalize text-xl font-semibold  text-gray-900 dark:text-gray-200 mb-4">
          Edit Job
        </h3>
        <div className="flex flex-col gap-2 md:flex-row">
          <FormRowInput
            title="Position"
            name="position"
            inputType="text"
            type="position"
            register={register}
            errors={errors.position}
          />
          <FormRowInput
            title="Company"
            name="company"
            inputType="text"
            type="company"
            register={register}
            errors={errors.company}
          />
          <FormRowInput
            title="Job Location"
            name="jobLocation"
            inputType="text"
            type="jobLocation"
            register={register}
            errors={errors.jobLocation}
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <FormRowSelect
            name="Status"
            type="status"
            register={register}
            errors={errors.status}
            list={state.statusOptions}
          />
          <FormRowSelect
            name="Job Type"
            type="jobType"
            register={register}
            errors={errors.jobType}
            list={state.jobTypeOptions}
          />

          <div className="w-full flex flex-col md:flex-row items-center gap-2  mt-2">
            <button
              className=" px-4 py-2  font-bold text-white capitalize bg-black w-full  rounded hover:bg-yellow-500 focus:outline-none focus:shadow-outline dark:bg-yellow-500 dark:text-gray-200 dark:hover:bg-yellow-700"
              type="submit"
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className=" px-4 py-2 font-bold text-white w-full bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline  dark:text-gray-200 dark:hover:bg-gray-400"
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
      </div>
    </form>
  );
};

export default EditJobComponent;
