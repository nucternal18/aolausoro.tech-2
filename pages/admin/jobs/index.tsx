import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

import { JobsContainer, SearchForm, AdminLayout } from "components";
import { NEXT_URL } from "config";
import getUser from "lib/getUser";
import { JobsProps } from "lib/types";

function Jobs({ jobs, isLoading }) {
  return (
    <AdminLayout title="Admin - All Jobs">
      <div className="md:p-4">
        <SearchForm />
        <JobsContainer jobs={jobs} isLoading={isLoading} />
      </div>
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

  const response = await fetch(`${NEXT_URL}/api/jobs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.cookie,
    },
  });

  const jobs = (await response.json()) as JobsProps;
  return {
    props: {
      jobs,
      isLoading: jobs ? false : true,
    }, // will be passed to the page component as props
  };
};

export default Jobs;
