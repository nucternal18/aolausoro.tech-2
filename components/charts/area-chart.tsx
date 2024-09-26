"use client";

import type { MonthlyApplicationProps } from "@src/entities/models/Job";
import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// zod schema

const AreaChartComponent = ({ data }: { data: MonthlyApplicationProps[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area dataKey="count" type="monotone" fill="#bef8fd" stroke="#2cb1bc" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
