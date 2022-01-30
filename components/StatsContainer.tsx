import React from "react";
import { StatsItem } from ".";
import {
  FaSuitcaseRolling,
  FaCalendarCheck,
  FaBug,
  FaFileContract,
} from "react-icons/fa";

export type DefaultStatsProps = {
  title: string;
  count: number;
  icon: React.ReactElement;
  textColor: string;
  borderColor: string;
  bcg: string;
};

interface StatsContainerProps {
  pending: number;
  interview: number;
  declined: number;
  offer: number;
}

const StatsContainer = ({ stats }: { stats: StatsContainerProps }) => {
  const defaultStats: DefaultStatsProps[] = [
    {
      title: "pending applications",
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling fontSize={18} color="#e9b949" />,
      textColor: "text-[#e9b949]",
      borderColor: "border-[#e9b949]",
      bcg: "bg-[#fcefc7]",
    },
    {
      title: "interviews scheduled",
      count: stats.interview || 0,
      icon: <FaCalendarCheck fontSize={18} color="#647acb" />,
      textColor: "text-[#647acb]",
      borderColor: "border-[#647acb]",
      bcg: "bg-[#e0e8f9]",
    },
    {
      title: "jobs declined",
      count: stats.declined || 0,
      icon: <FaBug fontSize={18} color="#d66a6a" />,
      textColor: "text-[#d66a6a]",
      borderColor: "border-[#d66a6a]",
      bcg: "bg-[#ffeeee]",
    },
    {
      title: "offers received",
      count: stats.offer || 0,
      icon: <FaFileContract fontSize={18} color="#14b8a8" />,
      textColor: "text-[#14b8a8]",
      borderColor: "border-[#14b8a8]",
      bcg: "bg-[#CDF8FD]",
    },
  ];
  return (
    <section className="px-2 mx-auto max-w-screen-xl my-6 font-mono md:px-4">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {defaultStats.map((item, index) => {
          return <StatsItem key={index} {...item} />;
        })}
      </div>
    </section>
  );
};

export default StatsContainer;
