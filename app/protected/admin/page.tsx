"use client";
// Components

import Loader from "@components/Loader";

// redux
import { useGetStatsQuery } from "app/global-redux-store/features/jobs/jobsApiSlice";

// components
import StatsContainer from "@components/stats-container";
import ChartsContainer from "@components/charts-container";

// zod schema
import type { DefaultStatsProps, MonthlyApplicationProps } from "schema/Job";
import { Typography } from "@components/typography";

const admin = () => {
  const { data: stats, isFetching } = useGetStatsQuery();
  console.log("Monthly Stats", stats?.monthlyApplicationStats);
  if (isFetching) {
    <section className="w-full h-full flex items-center justify-center">
      <Loader classes="w-8 h-8" />
    </section>;
  }
  return (
    <section className="w-full min-h-screen container mx-auto flex flex-col py-4">
      <Typography variant="h2" className="text-primary">
        Dashboard
      </Typography>
      <div className="flex flex-col gap-4 w-full h-full">
        <StatsContainer stats={stats?.defaultStats as DefaultStatsProps} />
        {stats && (
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
