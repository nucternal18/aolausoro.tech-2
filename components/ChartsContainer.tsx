"use client";
import { useState } from "react";
import BarChartComponent from "./charts/BarChart";
import AreaChartComponent from "./charts/AreaChart";
import type { MonthlyApplicationProps } from "schema/Job";
import { Button } from "./ui/button";
import { Typography } from "./Typography";

const ChartsContainer = ({
  monthlyStats,
}: {
  monthlyStats: MonthlyApplicationProps[];
}) => {
  const [barChart, setBarChart] = useState(true);
  return (
    <section className="px-4 mx-auto container mt-24 font-mono text-gray-900 dark:text-gray-200 md:px-6 flex flex-col gap-4">
      <div className="flex flex-col gap-2 justify-start">
        <Typography variant="h2" className="text-primary">
          Monthly Application
        </Typography>
        <Typography className="text-primary/50">
          Here you can see the monthly application stats
        </Typography>
        <Button
          onClick={() => setBarChart(!barChart)}
          className="text-teal-500 text-lg md:w-1/4"
        >
          {barChart ? "AreaChart" : "BarChart"}
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
  );
};

export default ChartsContainer;
