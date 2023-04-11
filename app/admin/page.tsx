"use client";
import { Suspense } from "react";

// Components
import { ChartsContainer, StatsContainer } from "components";
import Loader from "components/Loader";

// redux
import { useGetStatsQuery } from "app/GlobalReduxStore/features/jobs/jobsApiSlice";
import { DefaultStatsProps } from "lib/types";

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

export default admin;
