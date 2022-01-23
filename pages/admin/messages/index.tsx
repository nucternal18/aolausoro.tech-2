import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import AdminLayout from "components/layout/AdminLayout";
import MessageTable from "components/Table/MessageTable";
import { NEXT_URL } from "config";
import getUser from "lib/getUser";

function Messages({ messages, token }) {
  const router = useRouter();
  const deleteMessage = async (id) => {
    const res = await fetch(`${NEXT_URL}/api/messages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        cookie: token,
      },
    });
    if (res.ok) {
      toast.success("Message deleted successfully");
      router.push("/admin/messages");
    }
  };
  return (
    <AdminLayout title="aolausoro.tech - admin">
      <section className=" items-center  flex-grow w-full h-screen px-4 mx-auto  md:px-10">
        <div className="items-center  w-full p-6 my-4 overflow-hidden rounded  md:w-2/4 md:mx-auto">
          <p className="mb-2 text-2xl font-bold text-center md:text-4xl dark:text-gray-300">
            Messages
          </p>
        </div>
        <MessageTable
          messages={messages}
          router={router}
          deleteMessage={deleteMessage}
        />
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
  const res = await fetch(`${NEXT_URL}/api/contact`, {
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
    props: { messages: data, token: req.headers.cookie },
  };
};

export default Messages;
