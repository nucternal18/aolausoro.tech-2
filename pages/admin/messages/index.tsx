import AdminLayout from "components/AdminLayout";
import { NEXT_URL } from "config";
import getUser from "lib/getUser";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import nookies from "nookies";

function index({ messages }) {
  console.log(messages);
  return (
    <AdminLayout title="aolausoro.tech - admin">
      <section className="flex items-center justify-center flex-grow w-full h-screen px-4 mx-auto  md:px-10">
        <div className="items-center justify-center w-full p-6 my-4 overflow-hidden rounded shadow-lg dark:shadow-none md:w-2/4 md:mx-auto">
          <p className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
            messages
          </p>
        </div>
      </section>
    </AdminLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
  const res = await fetch(`${NEXT_URL}/api/contact/getMessages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${req.headers.cookie}`,
      cookie: req.headers.cookie,
    },
  });

  const data = await res.json();

  if (!data) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  return {
    props: { messages: data },
  };
};

export default index;
