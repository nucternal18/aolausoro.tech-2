import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

import { usePortfolio } from "context/portfolioContext";
import AdminLayout from "components/AdminLayout";
import getUser from "lib/getUser";
import UploadForm from "components/UploadForm";
import { getSession } from "next-auth/react";
import { NEXT_URL } from "config";

function project({ project }) {
  console.log(project);
  return (
    <AdminLayout title="">
      <section className="flex items-center  flex-grow w-full h-screen px-4 mx-auto  md:px-10">
        <div className="items-center w-full p-6 my-4 overflow-hidden rounded shadow-lg dark:shadow-none md:w-2/4 md:mx-auto">
          <p className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
            Add latest projects
          </p>
          <UploadForm project={project} />
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
    props: { project: data },
  };
};

export default project;
