import getUser from "lib/getUser";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import React from "react";

function UserProfile({ user }) {
  console.log(user);
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const req = ctx.req;
  const session = await getSession({ req });
  console.log(session);
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

  return {
    props: {
      user: userData,
    }, // will be passed to the page component as props
  };
};

export default UserProfile;
