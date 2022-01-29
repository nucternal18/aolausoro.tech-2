import EditJobComponent from "components/forms/EditJobComponent";
import AdminLayout from "components/layout/AdminLayout";
import { NEXT_URL } from "config";
import getUser from "lib/getUser";
import { JobProps } from "lib/types";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

function Job({ job, cookie }: { job: JobProps; cookie: string }) {
  return (
    <AdminLayout title="Admin - Job Details">
      <EditJobComponent job={job} cookie={cookie} />
    </AdminLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const req = ctx.req;
  const { id } = ctx.params;
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

  const res = await fetch(`${NEXT_URL}/api/jobs/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.cookie,
    },
  });
  const job = await res.json();
  return {
    props: {
      job,
      cookie: req.headers.cookie,
    }, // will be passed to the page component as props
  };
};
export default Job;
