"use client";

import { useCallback } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// redux
import {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useUploadImageMutation,
  useCreateProjectMutation,
  useDeleteProjectMutation,
} from "@app/GlobalReduxStore/features/projects/projectApiSlice";
import { useAppDispatch, useAppSelector } from "app/GlobalReduxStore/hooks";
import {
  setImage,
  projectSelector,
} from "app/GlobalReduxStore/features/projects/projectsSlice";

// components
import { useToast } from "@components/ui/use-toast";
import { type PartialProjectProps, partialProjectSchema } from "schema/Project";

const types = ["image/png", "image/jpeg", "image/jpg"];

export default function useProjectController(
  id?: string,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const state = useAppSelector(projectSelector);

  // get projects
  const {
    data: projects,
    isLoading,
    refetch,
  } = useGetProjectsQuery(undefined, {
    skip: id ? true : false,
  });

  // get project by id
  const { data: project, isLoading: isLoadingProject } = useGetProjectByIdQuery(
    id as string,
    {
      skip: !id,
    },
  );

  // project mutations
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  // filter current tech stack for form field
  const techStacks = project?.techStack?.map((stack: string) => {
    return {
      content: stack,
    };
  });

  const projectImage = state.image ? state.image : project?.url;

  const form = useForm<PartialProjectProps>({
    resolver: zodResolver(partialProjectSchema),
    defaultValues: {
      published: false,
      projectName: "",
      github: "",
      address: "",
      description: "",
      controlledTechStack: [],
    },
  });

  const formField = useFieldArray({
    control: form.control,
    name: "controlledTechStack",
  });

  const imageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    if (file && types.includes(file.type)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        dispatch(setImage(reader.result as string));
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Error uploading image. Please try again.",
        });
      };
    } else {
      toast({
        title: "Error",
        description: "Please select an image file (png or jpeg)",
      });
    }
  };

  const createProjectHandler: SubmitHandler<PartialProjectProps> = useCallback(
    async (data) => {
      const updateTechStacks = data.controlledTechStack?.map((stack) => {
        return stack.content;
      });

      const newProjectData = {
        projectName: data.projectName,
        github: data.github,
        address: data.address,
        techStacks: updateTechStacks,
        description: data.description,
        published: data.published,
        url: state.image ? state.image : "",
      };

      try {
        const response = await createProject(newProjectData).unwrap();
        if (response.success) {
          toast({
            title: "Success",
            description: response.message,
          });
          refetch();
          setOpen!(false);
          form.reset();
          dispatch(setImage(""));
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error creating project. Please try again.",
        });
      }
    },
    [state.image, project],
  );

  const updateProjectHandler: SubmitHandler<PartialProjectProps> = useCallback(
    async (data) => {
      const updateTechStacks = data.controlledTechStack?.map((stack) => {
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
        const response = await updateProject(newProjectData).unwrap();
        if (response.success) {
          toast({
            title: "Success",
            description: response.message,
          });
          form.reset();
          dispatch(setImage(""));
          router.push("/admin/projects");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error updating project. Please try again.",
        });
      }
    },
    [state.image, project],
  );

  const deleteProjectHandler = useCallback(async (id: string) => {
    try {
      const response = await deleteProject(id).unwrap();
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        refetch();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting project. Please try again.",
      });
    }
  }, []);

  return {
    projects,
    project,
    isLoading,
    isLoadingProject,
    isUpdating,
    isUploading,
    isCreating,
    isDeleting,
    form,
    formField,
    techStacks,
    projectImage,
    imageChangeHandler,
    createProjectHandler,
    updateProjectHandler,
    deleteProjectHandler,
  };
}
