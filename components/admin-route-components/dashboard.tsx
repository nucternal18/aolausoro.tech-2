'use client'

import { useQuery } from '@tanstack/react-query'
// components
import StatsContainer from '@components/stats-container'
import ChartsContainer from '@components/charts-container'

// zod schema
import { getStats } from '@components/admin-route-components/actions/jobs'
import type {
  DefaultStatsProps,
  MonthlyApplicationProps,
  StatsProps,
} from '@src/entities/models/Job'
import { Suspense } from 'react'
import Loader from '@components/Loader'

export function Dashboard({ statsData }: { statsData: StatsProps }) {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    initialData: statsData,
    refetchOnMount: false,
  })

  if (error) {
    return (
      <section className="min-h-screen w-full">
        <div>Error: {error?.message}</div>
      </section>
    )
  }

  return (
    <section className="container mx-auto flex min-h-screen w-full flex-col py-4">
      <h2 className="text-primary scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Dashboard
      </h2>
      <div className="flex h-full w-full flex-col gap-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <Loader classes="w-8 h-8" />
            </div>
          }
        >
          <StatsContainer stats={stats?.defaultStats as DefaultStatsProps} />
          {stats && (
            <ChartsContainer
              monthlyStats={
                'monthlyApplicationStats' in stats
                  ? (stats.monthlyApplicationStats as MonthlyApplicationProps[])
                  : []
              }
            />
          )}
        </Suspense>
      </div>
    </section>
  )
}
