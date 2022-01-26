import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

import { useGlobalApp } from "context/appContext";
import FormRowSelect from "./FormRowSelect";
import FormRowInput from "./FormRowInput";

interface IFormData {
  position: string;
  company: string;
  jobLocation: string;
  jobType: string;
  jobTypeOptions: string[];
  status: string;
  statusOptions: string[];
}

const AddJobComponent = ({ submitHandler }) => {
  const { state, dispatch } = useGlobalApp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      position: "",
      company: "",
      jobLocation: state.job?.jobLocation,
      jobType: state.job?.jobType,
      status: state.job?.status,
    },
  });

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    if (!data.position || !data.company || !data.jobLocation) {
      toast.error("Please fill out all fields");
      return;
    }
    console.log("Create Job", data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className=" p-2  max-w-screen-xl  bg-white dark:bg-gray-900 shadow-xl mt-5 mx-2 md:p-4">
        <h3 className="capitalize text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
          {state.isEditing ? "edit job" : "add job"}
        </h3>
        <div className="flex flex-col gap-2 md:flex-row">
          <FormRowInput
            title="Position"
            name="position"
            inputType="text"
            type="position"
            register={register}
            errors={errors}
          />
          <FormRowInput
            title="Company"
            name="company"
            inputType="text"
            type="company"
            register={register}
            errors={errors}
          />
          <FormRowInput
            title="Job Location"
            name="jobLocation"
            inputType="text"
            type="jobLocation"
            register={register}
            errors={errors}
          />
        </div>
        <div className="flex flex-col gap-2 md:flex-row ">
          <FormRowSelect
            name="Status"
            type="status"
            register={register}
            errors={errors.status}
            list={state.job.statusOptions}
          />
          <FormRowSelect
            name="Job Type"
            type="jobType"
            register={register}
            errors={errors.jobType}
            list={state.job.jobTypeOptions}
          />

          <div className="w-full flex flex-col md:flex-row items-center gap-2  mt-2">
            <button
              className=" px-4 py-2  font-bold text-white bg-black w-full  rounded hover:bg-yellow-500 focus:outline-none focus:shadow-outline dark:bg-yellow-500 dark:text-gray-200 dark:hover:bg-yellow-700"
              type="submit"
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

export default AddJobComponent;
