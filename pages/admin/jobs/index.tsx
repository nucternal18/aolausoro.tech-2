import { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";

import { JobsContainer, SearchForm, AdminLayout } from "components";
import { NEXT_URL } from "config";
import getUser from "lib/getUser";
import { JobsProps } from "lib/types";
import { useGlobalApp } from "context/appContext";

interface IFormData {
  search: string;
  company: string;
  sort: string;
  sortOptions: string[];
  jobType: string;
  jobTypeOptions: string[];
  status: string;
  statusOptions: string[];
}

function Jobs({ jobs, isLoading }) {
  const router = useRouter();
  const { state } = useGlobalApp();
  const page = state.job?.page;
  const {
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      search: "",
      status: state.job?.searchStatus,
      jobType: state.job?.searchType,
      sort: state.job?.sort,
    },
  });

  useEffect(() => {
    const subscribe = watch((data) => {
      const { search, sort, jobType, status } = data;
      let url = `${NEXT_URL}/admin/jobs?page=${page}&sort=${sort}&jobType=${jobType}&status=${status}`;
      if (search) {
        url += `&search=${search}`;
      }
      router.replace(url);
    });
    return () => subscribe.unsubscribe();
  }, [watch, page]);

  return (
    <AdminLayout title="Admin - All Jobs">
      <div className="md:p-4">
        <SearchForm register={register} reset={reset} errors={errors} />
        <JobsContainer jobs={jobs} isLoading={isLoading} />
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const req = ctx.req;
  const { sort, jobType, status, search, page } = ctx.query;
  const session = await getSession({ req });

  if (!session) {
    // If no token is present redirect user to the login page
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const userData = await getUser(req);

  if (!userData?.isAdmin) {
    return {
      redirect: {
        destination: "/not-authorized",
        permanent: false,
      },
    };
  }
  let url = `jobs?page=${page || 1}&sort=${sort || "all"}&jobType=${
    jobType || "all"
  }&status=${status || "all"}`;
  if (search) {
    url += `&search=${search}`;
  }

  const response = await fetch(`${NEXT_URL}/api/${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.cookie,
    },
  });

  const jobs = (await response.json()) as JobsProps;
  return {
    props: {
      jobs,
      isLoading: jobs ? false : true,
    }, // will be passed to the page component as props
  };
};

export default Jobs;
