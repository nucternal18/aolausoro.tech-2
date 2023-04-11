"use client";
import { Suspense } from "react";

// Components
import { ChartsContainer, Spinner, StatsContainer } from "components";

// redux
import { useGetStatsQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";
import { DefaultStatsProps } from "lib/types";
import Loader from "components/Loader";

const admin = () => {
  const { data: stats, isLoading } = useGetStatsQuery();
  console.log("🚀 ~ file: page.tsx:14 ~ admin ~ stats:", stats);

  if (isLoading) {
    <section className="w-full h-full flex items-center justify-center">
      <Loader classes="w-8 h-8" />
    </section>;
  }
  return (
    <section className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4 w-full h-full">
        <StatsContainer stats={stats?.defaultStats as DefaultStatsProps} />
        {/* {stats!.monthlyApplicationStats?.length > 0 && (
          <ChartsContainer monthlyStats={stats?.monthlyApplicationStats} />
        )} */}
      </div>
    </section>
  );
};

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const req = ctx.req;
//   const session = await getSession({ req });
//   if (!session) {
//     // If no token is present redirect user to the login page
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }
//   const userData = await getUser(req);

//   if (!userData?.isAdmin) {
//     return {
//       redirect: {
//         destination: "/not-authorized",
//         permanent: false,
//       },
//     };
//   }

//   const res = await fetch(`${NEXT_URL}/api/jobs/stats`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       cookie: req.headers.cookie,
//     },
//   });
//   const stats = await res.json();
//   return {
//     props: {
//       stats,
//       isLoading: stats ? false : true,
//     }, // will be passed to the page component as props
//   };
// };

export default admin;
