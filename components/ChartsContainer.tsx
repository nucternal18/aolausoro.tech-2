"use client";
import { useState } from "react";
import BarChartComponent from "./charts/BarChart";
import AreaChartComponent from "./charts/AreaChart";
import type { MonthlyApplicationProps } from "schema/Job";

const ChartsContainer = ({
  monthlyStats,
}: {
  monthlyStats: MonthlyApplicationProps[];
}) => {
  const [barChart, setBarChart] = useState(true);
  return (
    <section className="px-4 mx-auto max-w-screen-xl mt-24 font-mono text-gray-900 dark:text-gray-200 md:px-6 flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-col gap-4">
        <h5 className="text-2xl font-semibold">Monthly Applications</h5>
        <button
          type="button"
          onClick={() => setBarChart(!barChart)}
          className="text-teal-500 text-lg"
        >
          {barChart ? "AreaChart" : "BarChart"}
        </button>
      </div>
      {barChart ? (
        <BarChartComponent data={monthlyStats} />
      ) : (
        <AreaChartComponent data={monthlyStats} />
      )}
    </section>
  );
};

export default ChartsContainer;
