'use client'
import { useState } from 'react'
import BarChartComponent from './charts/bar-chart'
import AreaChartComponent from './charts/area-chart'
import type { MonthlyApplicationProps } from '@src/entities/models/Job'
import { Button } from './ui/button'
import { Typography } from './Typography'

const ChartsContainer = ({ monthlyStats }: { monthlyStats: MonthlyApplicationProps[] }) => {
  const [barChart, setBarChart] = useState(true)
  return (
    <section className="container mx-auto mt-24 flex flex-col gap-4 px-4 font-mono text-gray-900 md:px-6 dark:text-gray-200">
      <div className="flex flex-col justify-start gap-2">
        <Typography variant="h2" className="text-primary">
          Monthly Application
        </Typography>
        <Typography className="text-primary/50">
          Here you can see the monthly application stats
        </Typography>
        <Button onClick={() => setBarChart(!barChart)} className="text-lg text-teal-500 md:w-1/4">
          {barChart ? 'AreaChart' : 'BarChart'}
        </Button>
      </div>
      <div className="flex items-center justify-center">
        {barChart ? (
          <BarChartComponent data={monthlyStats} />
        ) : (
          <AreaChartComponent data={monthlyStats} />
        )}
      </div>
    </section>
  )
}

export default ChartsContainer
