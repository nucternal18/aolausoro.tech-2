"use client";

import { useQuery } from "@tanstack/react-query";
// components
import StatsContainer from "@components/stats-container";
import ChartsContainer from "@components/charts-container";

// zod schema
import { getStats } from "@app/actions/jobs";
import type {
  DefaultStatsProps,
  MonthlyApplicationProps,
  StatsProps,
} from "@src/entities/models/Job";
import { Suspense } from "react";
import Loader from "@components/Loader";


export function Dashboard({ statsData }: { statsData: StatsProps }) {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    initialData: statsData,
    refetchOnMount: false,
  });

  if (error) {
    return (
      <section className="w-full min-h-screen">
        <div>Error: {error?.message}</div>
      </section>
    );
  }

  return (
    <section className="container flex flex-col py-4 mx-auto w-full min-h-screen">
      <h2 className="pb-2 text-3xl font-semibold tracking-tight text-primary scroll-m-20 first:mt-0">
        Dashboard
      </h2>
      <div className="flex flex-col gap-4 w-full h-full">
        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <Loader classes="w-8 h-8" />
            </div>
          }
        >
          <StatsContainer stats={stats?.defaultStats as DefaultStatsProps} />
          {stats && (
            <ChartsContainer
              monthlyStats={
                "monthlyApplicationStats" in stats
                  ? (stats.monthlyApplicationStats as MonthlyApplicationProps[])
                  : []
              }
            />
          )}
        </Suspense>
      </div>
    </section>
  );
}
