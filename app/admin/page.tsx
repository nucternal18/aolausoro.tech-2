"use client";
// Components

import Loader from "components/Loader";

// redux
import { useGetStatsQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";
import { type DefaultStatsProps } from "types/types";
import StatsContainer from "@components/StatsContainer";

const admin = () => {
  const { data: stats, isFetching } = useGetStatsQuery();

  if (isFetching) {
    <section className="w-full h-full flex items-center justify-center">
      <Loader classes="w-8 h-8" />
    </section>;
  }
  return (
    <section className="w-full min-h-screen flex flex-col py-4">
      <div className="flex flex-col gap-4 w-full h-full">
        <StatsContainer stats={stats?.defaultStats as DefaultStatsProps} />
        {/* {stats!.monthlyApplicationStats?.length > 0 && (
          <ChartsContainer monthlyStats={stats?.monthlyApplicationStats} />
        )} */}
      </div>
    </section>
  );
};

export default admin;
