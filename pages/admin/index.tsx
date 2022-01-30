import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import getUser from "../../lib/getUser";

// Components
import AdminLayout from "components/layout/AdminLayout";
import { NEXT_URL } from "config";
import { ChartsContainer, Spinner, StatsContainer } from "components";

const admin = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <AdminLayout title="Admin - Dashboard">
        <section>
          <div className="flex items-center justify-center ">
            <Spinner message="Loading Stats..." />
          </div>
        </section>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout title="aolausoro.tech - admin">
      <StatsContainer stats={stats.defaultStats} />
      {stats.monthlyStats?.length > 0 && (
        <ChartsContainer monthlyStats={stats.monthlyStats} />
      )}
    </AdminLayout>
  );
};

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

  const res = await fetch(`${NEXT_URL}/api/jobs/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.cookie,
    },
  });
  const stats = await res.json();
  return {
    props: {
      stats,
      isLoading: stats ? false : true,
    }, // will be passed to the page component as props
  };
};

export default admin;
