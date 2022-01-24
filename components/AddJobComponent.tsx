import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

import { useGlobalApp } from "context/appContext";

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
    formState: { errors },
  } = useForm<IFormData>();

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    if (!data.position || !data.company || !data.jobLocation) {
      toast.error("Please fill out all fields");
      return;
    }
    console.log("Create Job", data);
  };

  return (
    <form>
      <div className=" px-4 mx-auto max-w-screen-xl pt-4  md:px-4">
        <h3 className="">{}</h3>
      </div>
    </form>
  );
};

export default AddJobComponent;
