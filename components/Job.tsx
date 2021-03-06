import React from "react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { useGlobalApp } from "context/appContext";
import { JobProps } from "lib/types";
import { ActionType } from "context/appActions";
import JobInfo from "./JobInfo";

const JobCard: React.FC<JobProps> = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  status,
}: JobProps): JSX.Element => {
  const router = useRouter();
  const date = moment(createdAt).format("MMMM Do, YYYY");
  const { dispatch, deleteJob } = useGlobalApp();

  const statusColor =
    status === "Pending"
      ? "bg-yellow-400"
      : status === "Interviewing"
      ? "bg-green-500"
      : "bg-red-500";
  const setEditJob = () => {
    dispatch({
      type: ActionType.JOB_EDIT_STATUS,
      payload: true,
    });
    router.push(`/admin/jobs/${_id}`);
  };
  return (
    <div className="px-1 py-2 bg-white dark:bg-gray-900 shadow-xl mt-5 mx-2 md:p-4">
      <header className="flex gap-4 items-center border-b-2 pb-4">
        <div className="inline-flex items-center justify-center p-2 bg-teal-500 rounded-md shadow-lg text-white w-12 h-12">
          {company.charAt(0)}
        </div>
        <div>
          <h5 className="text-lg font-base font-mono capitalize">{position}</h5>
          <p className="text-sm font-base font-mono text-gray-500 capitalize">
            {company}
          </p>
        </div>
      </header>
      <div className="my-2 grid grid-cols-2 border-b-2 py-4">
        <JobInfo icon={<FaLocationArrow fontSize={18} />} text={jobLocation} />
        <JobInfo icon={<FaCalendarAlt fontSize={18} />} text={date} />
        <JobInfo icon={<FaBriefcase fontSize={18} />} text={jobType} />
        <div
          className={`${statusColor} px-2 py-1 font-mono rounded-md shadow-lg text-white w-24`}
        >
          {status}
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
            onClick={() => deleteJob(_id)}
          >
            delete
          </button>
        </div>
      </footer>
    </div>
  );
};

export default JobCard;
