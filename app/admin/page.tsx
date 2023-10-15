"use client";
// Components

import Loader from "components/Loader";

// redux
import { useGetStatsQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";

// components
import StatsContainer from "@components/StatsContainer";
import ChartsContainer from "@components/ChartsContainer";

// zod schema
import type { DefaultStatsProps, MonthlyApplicationProps } from "schema/Job";

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
        {stats.monthlyApplicationStats?.length > 0 && (
          <ChartsContainer
            monthlyStats={
              stats?.monthlyApplicationStats as MonthlyApplicationProps[]
            }
          />
        )}
      </div>
    </section>
  );
};

export default admin;
