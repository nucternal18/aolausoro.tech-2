import AdminLayout from "components/layout/AdminLayout";
import getUser from "lib/getUser";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

function Job() {
  return <AdminLayout title="Admin - Job Details">Job Details</AdminLayout>;
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
  return {
    props: {}, // will be passed to the page component as props
  };
};
export default Job;
