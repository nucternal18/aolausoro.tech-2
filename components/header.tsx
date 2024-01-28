"use client";
import Title from "@components/title";
import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  bcg?: string;
  order: number;
  subOrder?: number;
  iconRight?: React.ReactElement;
  iconLeft?: React.ReactElement;
};

function Header({
  title,
  order,
  subOrder,
  subtitle,
  iconRight,
  iconLeft,
  bcg,
}: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1">
        {iconLeft ? (
          <div className={`flex items-center rounded-md shadow-lg`}>
            <div className="bg-violet-500 text-xl rounded-md">{iconLeft}</div>
          </div>
        ) : null}
        <Title order={order} className="text-gray-800 dark:text-gray-100">
          {title}
        </Title>
        {iconRight ? (
          <div className={`flex items-center rounded-md shadow-lg`}>
            <div className="bg-violet-500 text-xl rounded-md">{iconRight}</div>
          </div>
        ) : null}
      </div>
      <Title order={subOrder as number} className="font-light">
        {subtitle}
      </Title>
    </div>
  );
}

export default Header;
