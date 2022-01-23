import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "components/Button";
import { NEXT_URL } from "config";
import getUser from "lib/getUser";
import AdminLayout from "components/layout/AdminLayout";

function Message({ message }) {
  const router = useRouter();

  return (
    <AdminLayout title="aolausoro.tech - admin">
      <section className="max-w-screen-md w-full h-screen p-4 mx-auto  ">
        <div className="flex items-center justify-between w-full p-6 my-4 overflow-hidden border-b border-gray-800 dark:border-yellow-500 md:mx-auto">
          <div className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
            <h1 className="">
              <span className="mr-4">Message:</span>
              <span className="uppercase">{message.subject}</span>
            </h1>
          </div>
          <div>
            <button
              type="button"
              className="px-6 py-2.5 bg-yellow-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600 hover:shadow-lg focus:bg-yellow-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-yellow-700 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => router.back()}
            >
              Back
            </button>
          </div>
        </div>
        <div className="px-4 py-2 border h-fit">
          <div className="px-1 border-b mb-2 border-gray-800 dark:border-gray-300">
            <p className="mb-2 text-xl font-bold  dark:text-gray-300">
              <span className="mr-4 ">Name:</span>
              <span>{message.name}</span>
            </p>
          </div>
          <div className="px-1 border-b mb-2 border-gray-800 dark:border-gray-300">
            <p className="mb-2 text-xl font-bold dark:text-gray-300">
              <span className="mr-4 ">Email:</span>
              <span>{message.email}</span>
            </p>
          </div>
          <div className="px-1 border-b mb-2 border-gray-800 dark:border-gray-300">
            <p className="mb-2 text-xl font-bold  dark:text-gray-300">
              <span className="mr-4 ">Subject:</span>
              <span>{message.subject}</span>
            </p>
          </div>
          <div className="px-1 py-4 ">
            <p className="mb-2 text-xl font-bold  dark:text-gray-300">
              <span>{message.message}</span>
            </p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { id } = ctx.params;
  const req = ctx.req;
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
  const res = await fetch(`${NEXT_URL}/api/contact/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.cookie,
    },
  });

  const data = await res.json();

  if (!data) {
    return {
      redirect: {
        destination: "/admin/messages",
        permanent: false,
      },
    };
  }

  return {
    props: { message: data, messageId: id },
  };
};

export default Message;
