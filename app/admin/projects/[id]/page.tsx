"use client";
import { useCallback, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

// components
import UploadForm from "components/forms/UploadForm";

// redux
import {
  useGetProjectByIdQuery,
  useUploadImageMutation,
  useUpdateProjectMutation,
} from "app/GlobalReduxStore/features/projects/projectApiSlice";
import { useAppSelector } from "app/GlobalReduxStore/hooks";
import { projectSelector } from "app/GlobalReduxStore/features/projects/projectsSlice";

interface IFormInputs {
  projectName: string;
  github: string;
  address: string;
  techStack: string[];
}

function project({ params }: { params: { id: string } }) {
  const { data: project, refetch } = useGetProjectByIdQuery(params.id);
  const [techStack, setTechStack] = useState<Array<string>>(project.techStack);
  const state = useAppSelector(projectSelector);
  const [uploadImage] = useUploadImageMutation();
  const [updateProject] = useUpdateProjectMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      projectName: project.projectName,
      github: project.github,
      address: project.address,
    },
  });

  const updateTechStack = (tech: string) => {
    const existingTech = techStack.find((t) => t === tech);
    return !existingTech ? setTechStack([...techStack, tech]) : techStack;
  };

  const types = ["image/png", "image/jpeg", "image/jpg"];

  const changeHandler = (e) => {
    const file = e.target.files[0];

    if (file && types.includes(file.type)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        uploadImage(reader.result);
      };
      reader.onerror = () => {
        toast.error("something went wrong!");
      };
    } else {
      toast.error("Please select an image file (png or jpeg)");
    }
  };
  const onSubmit: SubmitHandler<IFormInputs> = useCallback(async (data) => {
    const project = {
      projectName: data.projectName,
      github: data.github,
      address: data.address,
      techStack,
      id: params.id,
    };
    // updateProject(project);
    try {
      const response = await updateProject(project).unwrap();
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Error updating project");
    }
  }, []);
  return (
    <section className="flex items-center w-full h-screen px-4 mx-auto ">
      <div className="items-center w-full p-6 my-4 overflow-hidden rounded shadow-lg dark:shadow-none md:w-2/4 md:mx-auto">
        <p className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
          Add latest projects
        </p>
        <UploadForm
          changeHandler={changeHandler}
          handleSubmit={handleSubmit}
          register={register}
          onSubmit={onSubmit}
          imageUrl={state.image}
          errors={errors}
        />
      </div>
    </section>
  );
}

export default project;
