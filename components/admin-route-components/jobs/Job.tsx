import React from 'react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'

import JobInfo from './job-info'
import { Button } from '@components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card'
import { cn } from '@lib/utils'

import useJobsController from './use-jobs-controller'
import type { PartialJobProps } from '@src/entities/models/Job'

export function JobCard({ job }: { job: PartialJobProps }) {
  const router = useRouter()
  const date = moment(job.createdAt).format('MMMM Do, YYYY')
  const { deleteJobHandler } = useJobsController()

  const statusColor =
    job.status === 'Pending'
      ? 'bg-yellow-400'
      : job.status === 'Interviewing'
        ? 'bg-green-500'
        : 'bg-red-500'

  const shadowColor =
    job.status === 'Pending'
      ? 'shadow-yellow-500/50'
      : job.status === 'Interviewing'
        ? 'shadow-green-500/50'
        : 'shadow-red-500/50'

  const setEditJob = () => {
    router.push(`/protected/admin/jobs/${job.id}`)
  }

  return (
    <Card className={cn('bg-muted shadow-xl', shadowColor)}>
      <CardHeader>
        <div className="flex flex-row items-center gap-4">
          <CardTitle className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-teal-500 p-2 text-white shadow-lg">
            {job.company?.charAt(0)}
          </CardTitle>
          <CardDescription>
            <h5 className="font-base font-mono text-lg capitalize">{job.position}</h5>
            <p className="font-base font-mono text-sm text-gray-500 capitalize">{job.company}</p>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="my-2 grid grid-cols-2 border-b-2 py-4">
          <JobInfo icon={<FaLocationArrow fontSize={18} />} text={job.jobLocation as string} />
          <JobInfo icon={<FaCalendarAlt fontSize={18} />} text={date} />
          <JobInfo icon={<FaBriefcase fontSize={18} />} text={job.jobType as string} />
          <div
            className={`${statusColor} w-24 rounded-md px-2 py-1 font-mono text-white shadow-lg`}
          >
            {job.status}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            className="font-base rounded-md bg-cyan-500 px-4 py-2 font-mono text-sm text-white capitalize shadow-lg"
            onClick={setEditJob}
          >
            edit
          </Button>

          <Button variant={'destructive'} onClick={() => deleteJobHandler(job.id as string)}>
            delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
