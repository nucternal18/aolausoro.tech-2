import { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

import { usePortfolio } from "context/portfolioContext";
import AdminLayout from "components/layout/AdminLayout";
import getUser from "lib/getUser";
import UploadForm from "components/UploadForm";
import { getSession } from "next-auth/react";
import { NEXT_URL } from "config";

interface IFormInputs {
  projectName: string;
  github: string;
  address: string;
  techStack: string[];
}

function project({ project, projectId }) {
  const { state, uploadImage, updateProject } = usePortfolio();
  const [techStack, setTechStack] = useState<Array<string>>(project.techStack);
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
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    const project = {
      projectName: data.projectName,
      github: data.github,
      address: data.address,
      techStack,
      id: projectId,
    };
    updateProject(project);
  };
  return (
    <AdminLayout title="">
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
            imageUrl={state.imageUrl}
            errors={errors}
          />
        </div>
      </section>
    </AdminLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.params;
  const req = ctx.req;
  const session = await getSession({ req });

  if (!session) {
    // If no token is present redirect user to the login page
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const userData = await getUser(req);

  if (!userData?.isAdmin) {
    return {
      redirect: {
        destination: "/not-authorized",
        permanent: false,
      },
    };
  }
  const res = await fetch(`${NEXT_URL}/api/projects/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!data) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: { project: data, projectId: id },
  };
};

export default project;
