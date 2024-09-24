"use client";

import { isServer, useSuspenseQuery } from "@tanstack/react-query";
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

export function Dashboard() {
  const stats = useStats();

  if ("message" in stats && stats.error) {
    return (
      <section className="min-h-screen w-full">
        <div>Error: {stats.error?.message}</div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen container mx-auto flex flex-col py-4">
      <Typography variant="h2" className="text-primary">
        Dashboard
      </Typography>
      <div className="flex flex-col gap-4 w-full h-full">
        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <Loader classes="w-8 h-8" />
            </div>
          }
        >
          <StatsContainer
            stats={
              stats.data && "defaultStats" in stats.data
                ? stats.data.defaultStats
                : {
                    pending: 0,
                    interviewing: 0,
                    declined: 0,
                    offer: 0,
                  }
            }
          />
          {stats.data && (
            <ChartsContainer
              monthlyStats={
                "monthlyApplicationStats" in stats.data
                  ? (stats.data
                      .monthlyApplicationStats as MonthlyApplicationProps[])
                  : []
              }
            />
          )}
        </Suspense>
      </div>
    </section>
  );
}
