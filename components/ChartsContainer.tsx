import { useState } from "react";
import { AreaChartComponent, BarChartComponent } from ".";

const ChartsContainer = ({ monthlyStats }) => {
  const [barChart, setBarChart] = useState(true);
  return (
    <section className="px-4 mx-auto max-w-screen-xl mt-24 font-mono md:px-6 flex flex-col gap-4 items-center justify-center">
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
