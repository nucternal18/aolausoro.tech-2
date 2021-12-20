import { GetServerSidePropsContext } from "next";
import nookies from "nookies";
// Components
import AdminLayout from "components/AdminLayout";
import Table2 from "components/Table2";

// Context
import { usePortfolio } from "context/portfolioContext";
import getUser from "lib/getUser";
import { getSession } from "next-auth/react";
import { NEXT_URL } from "config";

function Projects({ projects }) {
  const { state } = usePortfolio();
  console.log(projects);
  return (
    <AdminLayout title="">
      <section className=" h-screen   py-10 md:px-8">
        <Table2 data={projects} />
      </section>
    </AdminLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
  const res = await fetch(`${NEXT_URL}/api/projects`, {
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
    props: { projects: data },
  };
};

export default Projects;
