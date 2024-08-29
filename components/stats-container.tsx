import {
  FaSuitcaseRolling,
  FaCalendarCheck,
  FaBug,
  FaFileContract,
} from "react-icons/fa";
import StatsItem from "./stats-item";

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
  interviewing: number;
  declined: number;
  offer: number;
}

const StatsContainer = ({ stats }: { stats: StatsContainerProps }) => {
  const defaultStats: DefaultStatsProps[] = [
    {
      title: "pending applications",
      count: stats?.pending || 0,
      icon: <FaSuitcaseRolling fontSize={18} color="#e9b949" />,
      textColor: "text-amber-500",
      borderColor: "shadow-amber-500",
      bcg: "bg-amber-100",
    },
    {
      title: "interviews scheduled",
      count: stats?.interviewing || 0,
      icon: <FaCalendarCheck fontSize={18} color="#647acb" />,
      textColor: "text-indigo-500",
      borderColor: "shadow-indigo-500",
      bcg: "bg-indigo-100",
    },
    {
      title: "jobs declined",
      count: stats?.declined || 0,
      icon: <FaBug fontSize={18} color="#d66a6a" />,
      textColor: "text-pink-500",
      borderColor: "shadow-pink-500",
      bcg: "bg-pink-100",
    },
    {
      title: "offers received",
      count: stats?.offer || 0,
      icon: <FaFileContract fontSize={18} color="#14b8a8" />,
      textColor: "text-teal-500",
      borderColor: "shadow-teal-500",
      bcg: "bg-teal-100",
    },
  ];
  return (
    <section className=" my-6 font-mono text-gray-900 dark:text-gray-200 ">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {defaultStats.map((item, index) => {
          return <StatsItem key={index} {...item} />;
        })}
      </div>
    </section>
  );
};

export default StatsContainer;
