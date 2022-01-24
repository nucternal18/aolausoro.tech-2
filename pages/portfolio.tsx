import Image from "next/image";
import { FaGithub, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";

// Components
import { Layout } from "../components/layout";

// Server address
import { NEXT_URL } from "../config";

import PortfolioCard from "components/PortfolioCard";

const Portfolio = ({ projects }) => {
  return (
    <Layout title="aolausoro.tech - Portfolio">
      <section className="max-w-screen-lg mx-auto mb-4 px-2 md:px-0">
        <div className="relative flex items-center justify-between mb-6 border-b border-current dark:border-yellow-500">
          <h1 className="my-4 text-5xl font-thin text-center text-black dark:text-yellow-500">
            PORTFOLIO
          </h1>
          <Link href="https://github.com/nucternal18?tab=repositories">
            <a className="px-2 py-2 flex items-center font-semibold text-gray-700 bg-transparent border border-gray-500 rounded hover:text-white dark:text-yellow-500 dark:border-yellow-500 hover:bg-gray-500 dark:hover:bg-yellow-500 dark:hover:text-white hover:border-transparent">
              <span>View GitHub</span>
              <FaChevronRight />
            </a>
          </Link>
        </div>

        <h2 className="text-2xl text-center text-black dark:text-gray-100">
          Some of my projects
        </h2>
      </section>
      <section className="max-w-screen-lg mx-auto mb-4">
        <div className="grid grid-cols-1 gap-3 px-4 my-4 sm:grid-cols-2 md:grid-cols-3 sm:px-0">
          {projects &&
            projects.map((doc) => <PortfolioCard key={doc._id} doc={doc} />)}
        </div>
      </section>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = await fetch(`${NEXT_URL}/api/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!data) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { projects: data },
  };
};

export default Portfolio;
