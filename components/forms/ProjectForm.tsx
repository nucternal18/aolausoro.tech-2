"use client";
import React from "react";
import { useCallback, useState } from "react";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { toast } from "react-toastify";

// redux
import {
  useUpdateProjectMutation,
  useUploadImageMutation,
  useCreateProjectMutation,
} from "app/GlobalReduxStore/features/projects/projectApiSlice";
import { useAppSelector, useAppDispatch } from "app/GlobalReduxStore/hooks";
import {
  projectSelector,
  setEditImage,
  setImage,
} from "app/GlobalReduxStore/features/projects/projectsSlice";
import { ProjectProps } from "lib/types";
import Image from "next/image";
import UploadForm from "./UploadForm";
import ToggleControlButton from "components/ToggleControlButton";

export interface IFormInput {
  projectName: string;
  github: string;
  address: string;
  description: string;
  published: boolean;
  techStack: { content: string }[];
}

const types = ["image/png", "image/jpeg", "image/jpg"];

function ProjectForm({
  project,
  refetch,
}: {
  project?: ProjectProps;
  refetch(): void;
}) {
  const state = useAppSelector(projectSelector);
  const dispatch = useAppDispatch();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [uploadImage] = useUploadImageMutation();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const techStacks = project?.techStack.map((stack: string) => {
    return {
      content: stack,
    };
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      projectName: "",
      github: "",
      address: "",
      description: "",
      techStack: [{ content: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techStack",
  });

  React.useEffect(() => {
    if (project) {
      reset({
        projectName: project?.projectName || "",
        github: project?.github || "",
        address: project?.address || "",
        description: project?.description || "",
        published: project?.published || false,
        techStack: techStacks,
      });
    }
  }, [project]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    if (file && types.includes(file.type)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        dispatch(setImage(reader.result as string));
      };
      reader.onerror = () => {
        toast.error("Something went wrong! Unable to upload image");
      };
    } else {
      toast.error("Please select an image file (png or jpeg)");
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = useCallback(
    async (data) => {
      const updateTechStacks = data.techStack.map((stack) => {
        return stack.content;
      });

      const newProjectData = {
        projectName: data.projectName,
        github: data.github,
        address: data.address,
        techStacks: updateTechStacks,
        description: data.description,
        published: data.published,
        id: project?.id,
        url: state.image ? state.image : project?.url,
      };

      try {
        if (state.action === "Create") {
          const response = await createProject(newProjectData).unwrap();
          if (response.success) {
            toast.success(response.message);
            refetch();
          }
        } else if (state.action === "Update") {
          const response = await updateProject(newProjectData).unwrap();
          if (response.success) {
            toast.success(response.message);
          }
        }
        reset();
        dispatch(setImage(""));
      } catch (error) {
        toast.error("Error updating project");
      }
    },
    [state.image, project]
  );

  const projectImage = state.image ? state.image : project?.url;

  return (
    <form
      className="grid grid-cols-1 gap-2 w-full mb-4 text-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="published"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <ToggleControlButton value={value} onChange={onChange} />
        )}
      />
      <div className="w-full h-[400px] border-2 p-2 flex flex-col items-center justify-center space-y-4  mb-4 border-gray-600 ">
        {projectImage ? (
          <Image
            src={projectImage as string}
            alt="Project image"
            width={250}
            height={250}
          />
        ) : (
          <UploadForm changeHandler={changeHandler} />
        )}
      </div>

      <div className="flex flex-col w-full mx-auto">
        <div className="mb-6 md:flex md:items-center">
          <label
            className="block mb-1 font-bold text-gray-500 md:text-right md:mb-0"
            htmlFor="project-name"
          />

          <input
            className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
            id="project-name"
            placeholder="Project Name"
            type="text"
            aria-label="project-name-input"
            aria-errormessage="project-name-error"
            aria-invalid="true"
            {...register("projectName", {
              required: "This is required",
              maxLength: {
                value: 20,
                message: "Maximum number of characters is 20",
              },
              pattern: {
                value: /^[A-Za-z. -]+$/,
                message: "Please enter your name",
              },
            })}
          />
        </div>
        {errors.projectName && (
          <span
            id="project-name-error"
            className="text-gray-800 dark:text-yellow-500"
          >
            {errors.projectName.message}
          </span>
        )}
        <div className="mb-6 md:flex md:items-center ">
          <label
            className="block mb-1 font-bold text-gray-500 md:text-right md:mb-0"
            htmlFor="github"
          />
          <input
            className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
            id="github"
            type="text"
            placeholder="Github Address"
            aria-label="github-input"
            aria-errormessage="github-error"
            aria-invalid="true"
            {...register("github", {
              required: "This is required",
              pattern: {
                value:
                  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/,
                message: "Please add a valid github address",
              },
            })}
          />
        </div>
        {errors.github && (
          <span
            id="github-error"
            className="text-gray-800 dark:text-yellow-500"
          >
            {errors.github.message}
          </span>
        )}
        <div className="mb-6 md:flex md:items-center ">
          <label
            className="block mb-1 font-bold text-gray-500 md:text-right md:mb-0"
            htmlFor="description"
          />
          <input
            className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
            id="description"
            type="text"
            placeholder="Description"
            aria-label="description-input"
            aria-errormessage="description-error"
            aria-invalid="true"
            {...register("description", {
              required: "This is required",
              pattern: {
                value: /^[A-Za-z0-9.?, -]+$/,
                message: "Please enter a description",
              },
            })}
          />
        </div>
        {errors.description && (
          <span
            id="github-error"
            className="text-gray-800 dark:text-yellow-500"
          >
            {errors.description.message}
          </span>
        )}
        <div className="mb-6 md:flex md:items-center ">
          <label
            className="block mb-1 font-bold text-gray-500 md:text-right md:mb-0"
            htmlFor="url-address"
          />

          <input
            className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
            id="url-address"
            type="text"
            placeholder="Web Address"
            aria-label="url-address-input"
            aria-errormessage="url-address-error"
            aria-invalid="true"
            {...register("address", {
              required: "This is required",
              pattern: {
                value:
                  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$/,
                message: "Please enter your name",
              },
            })}
          />
        </div>
        {errors.address && (
          <span
            id="url-address-error"
            className="text-gray-800 dark:text-yellow-500"
          >
            {errors.address.message}
          </span>
        )}
        <div className="mb-6 grid grid-cols-1 gap-2 md:items-center bg-gray-100 dark:bg-gray-800 ">
          <button
            type="button"
            className="border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 mb-2  transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
            onClick={() => append({ content: "" })}
          >
            APPEND TECH STACK
          </button>
          {fields.map((field, idx) => {
            return (
              <div
                className="bg-gray-100 dark:bg-gray-800 w-full mb-2 flex space-x-2"
                key={`${field}-${idx}`}
              >
                <input
                  {...register(`techStack.${idx}.content` as const)}
                  className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2  transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
                >
                  DELETE
                </button>
              </div>
            );
          })}
        </div>
        <div className="md:flex md:items-center">
          <div className="w-full mx-auto">
            <button
              className="w-full px-4 py-2 font-bold text-blue-700 border-2 border-blue-700 rounded dark:border-transparent dark:bg-yellow-500 dark:text-gray-100 hover:bg-blue-700 dark:hover:bg-yellow-700 focus:outline-none focus:shadow-outline hover:text-white"
              type="submit"
              disabled={state.action === "Update" ? isUpdating : isCreating}
            >
              {state.action === "Create" ? "Create Project" : "Update Project"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ProjectForm;
