"use client";

import { useCallback, useMemo } from "react";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "app/global-redux-store/hooks";
import {
  setImage,
  projectSelector,
} from "app/global-redux-store/features/projects/projectsSlice";

// components
import { useToast } from "@components/ui/use-toast";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@app/actions/projects";
import {
  partialProjectSchema,
  type PartialProjectProps,
} from "@src/entities/models/Project";

const types = ["image/png", "image/jpeg", "image/jpg"];

export default function useProjectController(
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const state = useAppSelector(projectSelector);

  const projectImage = state.image;

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

      const formData = new FormData();
      formData.append("projectName", data.projectName as string);
      formData.append("github", data.github as string);
      formData.append("address", data.address as string);
      formData.append("techStacks", JSON.stringify(updateTechStacks));
      formData.append("description", data.description as string);
      formData.append("published", data.published!.toString());
      formData.append("url", state.image as string);

      try {
        const response = await createProject(formData);
        if (response.success) {
          toast({
            title: "Success",
            description: response.message,
          });
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
    [state.image],
  );

  const updateProjectHandler: SubmitHandler<PartialProjectProps> = useCallback(
    async (data) => {
      const updateTechStacks = data.controlledTechStack?.map((stack) => {
        return stack.content;
      });

      const formData = new FormData();
      formData.append("projectName", data.projectName as string);
      formData.append("github", data.github as string);
      formData.append("address", data.address as string);
      formData.append("techStacks", JSON.stringify(updateTechStacks));
      formData.append("description", data.description as string);
      formData.append("published", data.published!.toString());
      formData.append("url", state.image as string);

      try {
        const response = await updateProject(formData);
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
    [state.image],
  );

  const deleteProjectHandler = useCallback(async (id: string) => {
    try {
      const response = await deleteProject(id);
      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting project. Please try again.",
      });
    }
  }, []);

  return {
    form,
    formField,
    projectImage,
    imageChangeHandler,
    createProjectHandler,
    updateProjectHandler,
    deleteProjectHandler,
  };
}
