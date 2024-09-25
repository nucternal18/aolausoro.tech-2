"use client";

import { isServer, useSuspenseQuery, useQuery } from "@tanstack/react-query";
// components
import StatsContainer from "@components/stats-container";
import ChartsContainer from "@components/charts-container";

// zod schema
import { Typography } from "@components/Typography";
import { getStats } from "@app/actions/jobs";
import type {
  DefaultStatsProps,
  MonthlyApplicationProps,
  StatsProps,
} from "@src/entities/models/Job";
import { Suspense } from "react";
import Loader from "@components/Loader";

function useStats() {
  const { data, isLoading, error } = useSuspenseQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  return { data, isLoading, error };
}

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
      <section className="min-h-screen w-full">
        <div>Error: {error?.message}</div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen container mx-auto flex flex-col py-4">
      <h2 className="text-primary scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
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
