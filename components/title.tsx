import React from "react";
import { cn } from "@lib/utils";

type TitleProps = {
  order: number;
  lineClamp?: number;
  className?: string;
  children: React.ReactNode;
};

type Size = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const sizes = [
  { h1: "text-5xl" },
  { h2: "text-4xl" },
  { h3: "text-3xl" },
  { h4: "text-2xl" },
  { h5: "text-xl" },
  { h6: "text-lg" },
];

function extractValueByKey<T extends object>(
  array: readonly T[],
  keyToFind: keyof T,
): T[keyof T] | undefined {
  const item = array.find((obj) => keyToFind in obj);
  return item ? item[keyToFind] : undefined;
}

export default function Title({
  order,
  lineClamp,
  className,
  children,
}: TitleProps) {
  const element = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
  const size = element[order] as Size;
  const fontSize = order ? extractValueByKey(sizes, size) : "text-5xl";
  const lineHeight = order === 1 ? `leading-${order}` : "leading-normal";

  const truncate = lineClamp ? `line-clamp-${lineClamp}` : "";

  if (element[order] === "h1") {
    return (
      <h1
        className={cn(
          `font-bold ${fontSize} ${lineHeight} ${truncate}`,
          className,
        )}
      >
        {children}
      </h1>
    );
  }
  if (element[order] === "h2") {
    return (
      <h2
        className={cn(
          `font-bold ${fontSize} ${lineHeight} ${truncate}`,
          className,
        )}
      >
        {children}
      </h2>
    );
  }
  if (element[order] === "h3") {
    return (
      <h3
        className={cn(
          `font-bold ${fontSize} ${lineHeight} ${truncate}`,
          className,
        )}
      >
        {children}
      </h3>
    );
  }
  if (element[order] === "h4") {
    return (
      <h4
        className={cn(
          `font-bold ${fontSize} ${lineHeight} ${truncate}`,
          className,
        )}
      >
        {children}
      </h4>
    );
  }
  if (element[order] === "h5") {
    return (
      <h5
        className={cn(
          `font-bold ${fontSize} ${lineHeight} ${truncate}`,
          className,
        )}
      >
        {children}
      </h5>
    );
  }
  if (element[order] === "h6") {
    return (
      <h6
        className={cn(
          `font-bold ${fontSize} ${lineHeight} ${truncate}`,
          className,
        )}
      >
        {children}
      </h6>
    );
  }

  return (
    <h1
      className={cn(
        `font-bold ${fontSize} ${lineHeight} ${truncate}`,
        className,
      )}
    >
      {children}
    </h1>
  );
}
