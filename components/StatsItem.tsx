import React from "react";
import { type DefaultStatsProps } from "./StatsContainer";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Typography } from "./Typography";

const StatsItem = ({
  count,
  title,
  icon,
  textColor,
  borderColor,
  bcg,
}: DefaultStatsProps) => {
  return (
    <Card
      className={`p-2 bg-white $ dark:bg-gray-900 shadow-xl mt-5 mx-2 md:p-4 border-b-4 rounded-md ${borderColor}`}
    >
      <CardHeader className="gap-4">
        <CardTitle>
          <div
            className={`inline-flex items-center justify-center p-2 ${bcg} rounded-md shadow-lg  w-12 h-12`}
          >
            {icon}
          </div>
        </CardTitle>
        <CardDescription>
          <Typography className="text-sm text-primary">{count}</Typography>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Typography variant="h5" className="text-primary capitalize">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatsItem;
