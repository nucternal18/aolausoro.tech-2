import React from "react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

import JobInfo from "./JobInfo";
import type { PartialJobProps } from "schema/Job";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { cn } from "@lib/utils";

import useJobsController from "./use-jobs-controller";

export function JobCard({ job }: { job: PartialJobProps }) {
  const router = useRouter();
  const date = moment(job.createdAt).format("MMMM Do, YYYY");
  const { deleteJobHandler, isDeleting } = useJobsController();

  const statusColor =
    job.status === "Pending"
      ? "bg-yellow-400"
      : job.status === "Interviewing"
        ? "bg-green-500"
        : "bg-red-500";

  const shadowColor =
    job.status === "Pending"
      ? "shadow-yellow-500/50"
      : job.status === "Interviewing"
        ? "shadow-green-500/50"
        : "shadow-red-500/50";

  const setEditJob = () => {
    router.push(`/protected/admin/jobs/${job.id}`);
  };

  return (
    <Card className={cn(" bg-muted shadow-xl", shadowColor)}>
      <CardHeader>
        <div className="flex flex-row items-center gap-4">
          <CardTitle className="inline-flex items-center justify-center p-2 bg-teal-500 rounded-md shadow-lg text-white w-12 h-12">
            {job.company?.charAt(0)}
          </CardTitle>
          <CardDescription>
            <h5 className="text-lg font-base font-mono capitalize">
              {job.position}
            </h5>
            <p className="text-sm font-base font-mono text-gray-500 capitalize">
              {job.company}
            </p>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="my-2 grid grid-cols-2 border-b-2 py-4">
          <JobInfo
            icon={<FaLocationArrow fontSize={18} />}
            text={job.jobLocation as string}
          />
          <JobInfo icon={<FaCalendarAlt fontSize={18} />} text={date} />
          <JobInfo
            icon={<FaBriefcase fontSize={18} />}
            text={job.jobType as string}
          />
          <div
            className={`${statusColor} px-2 py-1 font-mono rounded-md shadow-lg text-white w-24`}
          >
            {job.status}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            className="capitalize text-sm font-base font-mono bg-cyan-500 text-white py-2 px-4 rounded-md shadow-lg"
            onClick={setEditJob}
          >
            edit
          </Button>

          <Button
            disabled={isDeleting}
            variant={"destructive"}
            onClick={() => deleteJobHandler(job.id as string)}
          >
            delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
