import React from "react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

import JobInfo from "./JobInfo";
import type { PartialJobProps } from "schema/Job";

export function JobCard({ job }: { job: PartialJobProps }) {
  const router = useRouter();
  const date = moment(job.createdAt).format("MMMM Do, YYYY");

  const statusColor =
    job.status === "Pending"
      ? "bg-yellow-400"
      : job.status === "Interviewing"
        ? "bg-green-500"
        : "bg-red-500";
  const setEditJob = () => {
    // dispatch({
    //   type: ActionType.JOB_EDIT_STATUS,
    //   payload: true,
    // });
    router.push(`/admin/jobs/${job.id}`);
  };
  return (
    <div className="px-1 py-2 bg-white dark:bg-gray-900 shadow-xl mt-5 mx-2 md:p-4">
      <header className="flex gap-4 items-center border-b-2 pb-4">
        <div className="inline-flex items-center justify-center p-2 bg-teal-500 rounded-md shadow-lg text-white w-12 h-12">
          {job.company?.charAt(0)}
        </div>
        <div>
          <h5 className="text-lg font-base font-mono capitalize">
            {job.position}
          </h5>
          <p className="text-sm font-base font-mono text-gray-500 capitalize">
            {job.company}
          </p>
        </div>
      </header>
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
      <footer>
        <div className="flex flex-row items-center gap-2">
          <button
            type="button"
            className="capitalize text-sm font-base font-mono bg-cyan-500 text-white py-2 px-4 rounded-md shadow-lg"
            onClick={setEditJob}
          >
            edit
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-red-500 rounded-md shadow-lg capitalize text-sm font-base font-mono text-white"
            // onClick={() => deleteJob(id as string)}
          >
            delete
          </button>
        </div>
      </footer>
    </div>
  );
}
