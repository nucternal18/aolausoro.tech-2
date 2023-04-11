import EditJobComponent from "components/forms/EditJobComponent";
import { NEXT_URL } from "config";
import getUser from "lib/getUser";
import { JobProps } from "lib/types";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

function Job({ job, cookie }: { job: JobProps; cookie: string }) {
  return <EditJobComponent job={job} cookie={cookie} />;
}

export default Job;
