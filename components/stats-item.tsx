import React from 'react'
import { type DefaultStatsProps } from './stats-container'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card'
import { Typography } from './Typography'

const StatsItem = ({ count, title, icon, textColor, borderColor, bcg }: DefaultStatsProps) => {
  return (
    <Card
      className={`$ mx-2 mt-5 rounded-md border-b-4 bg-white p-2 shadow-xl md:p-4 dark:bg-gray-900 ${borderColor}`}
    >
      <CardHeader className="gap-4">
        <CardTitle>
          <div
            className={`inline-flex items-center justify-center p-2 ${bcg} h-12 w-12 rounded-md shadow-lg`}
          >
            {icon}
          </div>
        </CardTitle>
        <CardDescription>
          <span className="text-primary text-sm">{count}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Typography variant="h5" className="text-primary capitalize">
          {title}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default StatsItem
