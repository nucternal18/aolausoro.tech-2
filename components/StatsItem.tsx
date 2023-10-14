import React from "react";
import { type DefaultStatsProps } from "./StatsContainer";

const StatsItem = ({
  count,
  title,
  icon,
  textColor,
  borderColor,
  bcg,
}: DefaultStatsProps) => {
  return (
    <div
      className={`p-2 bg-white $ dark:bg-gray-900 shadow-xl mt-5 mx-2 md:p-4 border-b-4 rounded-md ${borderColor}`}
    >
      <header className={`flex justify-between items-center pb-4`}>
        <span
          className={`inline-flex items-center justify-center p-2 ${textColor} rounded-md shadow-lg  w-12 h-12`}
        >
          {count}
        </span>
        <div
          className={`inline-flex items-center justify-center p-2 ${bcg} rounded-md shadow-lg  w-12 h-12`}
        >
          {icon}
        </div>
      </header>
      <h5 className="text-xs sm:text-sm md:text-base capitalize mb-4">
        {title}
      </h5>
    </div>
  );
};

export default StatsItem;
